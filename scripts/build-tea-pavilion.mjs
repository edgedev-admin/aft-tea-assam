import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Offline hybrid-pavilion bake. Architecture is an authored RGB render, not a
// procedural room/GLB. The original documentary images remain unchanged.
const layout = JSON.parse(await fs.readFile("assets/tea-pavilion/layout.json", "utf8"));
const { chromium } = await import("../artifacts/ios-webkit/node_modules/playwright/index.mjs");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const reports = [];
try {
  for (const mode of ["desktop", "mobile"]) {
    const spec = layout[mode], source = await fs.readFile(spec.source);
    const { data, info } = await sharp(source).raw().toBuffer({ resolveWithObject: true });
    const displays = [];
    for (const display of spec.displays) {
      // The deliberately green, empty insets in the architectural source form a
      // precise coverage mask, retaining their original warm light grazers.
      const mask = Buffer.alloc(info.width * info.height * 4), [left, top, right, bottom] = display.bounds;
      for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
        const p = (y * info.width + x) * info.channels, q = (y * info.width + x) * 4;
        mask[q] = mask[q + 1] = mask[q + 2] = 255;
        const green = Math.min((data[p + 1] - data[p] - 1) / 4, (data[p + 1] - data[p + 2] - 3) / 5);
        mask[q + 3] = data[p] < 180 ? Math.round(255 * Math.max(0, Math.min(1, green))) : 0;
      }
      const png = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 4 } }).blur(1).png().toBuffer();
      displays.push({ ...display, image: `data:image/jpeg;base64,${(await fs.readFile(display.source)).toString("base64")}`, mask: `data:image/png;base64,${png.toString("base64")}` });
    }
    const page = await browser.newPage();
    await page.setContent("<canvas></canvas>");
    const png = await page.evaluate(async ({ background, displays }) => {
      const load = src => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });
      const base = await load(background), canvas = document.querySelector("canvas"); canvas.width = base.width; canvas.height = base.height;
      const ctx = canvas.getContext("2d"); ctx.drawImage(base, 0, 0);
      function triangle(context, image, source, destination) {
        const [a,b,c] = source, [p,q,r] = destination;
        const det = a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]);
        const solve = i => [(p[i]*(b[1]-c[1])+q[i]*(c[1]-a[1])+r[i]*(a[1]-b[1]))/det,(p[i]*(c[0]-b[0])+q[i]*(a[0]-c[0])+r[i]*(b[0]-a[0]))/det,(p[i]*(b[0]*c[1]-c[0]*b[1])+q[i]*(c[0]*a[1]-a[0]*c[1])+r[i]*(a[0]*b[1]-b[0]*a[1]))/det];
        const x=solve(0),y=solve(1),cx=(p[0]+q[0]+r[0])/3,cy=(p[1]+q[1]+r[1])/3;
        const padded=[p,q,r].map(v=>{const l=Math.hypot(v[0]-cx,v[1]-cy);return [v[0]+(v[0]-cx)/l*.8,v[1]+(v[1]-cy)/l*.8];});
        context.save(); context.beginPath(); context.moveTo(...padded[0]); context.lineTo(...padded[1]); context.lineTo(...padded[2]); context.closePath(); context.clip(); context.transform(x[0],y[0],x[1],y[1],x[2],y[2]); context.drawImage(image,0,0); context.restore();
      }
      for (const display of displays) {
        const image=await load(display.image),mask=await load(display.mask),layer=document.createElement("canvas");layer.width=base.width;layer.height=base.height;const paint=layer.getContext("2d");
        const [a,b,c,d]=display.quad, distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]), aspect=(distance(a,b)+distance(d,c))/(distance(a,d)+distance(b,c));
        const cropWidth=Math.min(image.width,image.height*aspect),cropHeight=cropWidth/aspect,x=(image.width-cropWidth)/2,y=(image.height-cropHeight)/2;
        const point=(u,v)=>[(1-v)*((1-u)*a[0]+u*b[0])+v*((1-u)*d[0]+u*c[0]),(1-v)*((1-u)*a[1]+u*b[1])+v*((1-u)*d[1]+u*c[1])];
        for(let row=0;row<12;row++)for(let col=0;col<12;col++) {
          const u=col/12,v=row/12,U=(col+1)/12,V=(row+1)/12;
          const source=[[x+u*cropWidth,y+v*cropHeight],[x+U*cropWidth,y+v*cropHeight],[x+U*cropWidth,y+V*cropHeight],[x+u*cropWidth,y+V*cropHeight]],dest=[point(u,v),point(U,v),point(U,V),point(u,V)];
          triangle(paint,image,[source[0],source[1],source[2]],[dest[0],dest[1],dest[2]]);triangle(paint,image,[source[0],source[2],source[3]],[dest[0],dest[2],dest[3]]);
        }
        paint.globalCompositeOperation="source-atop";paint.fillStyle=`rgba(0,0,0,${1-display.brightness})`;paint.fillRect(0,0,layer.width,layer.height);
        paint.globalCompositeOperation="destination-in";paint.drawImage(mask,0,0);ctx.drawImage(layer,0,0);
      }
      return canvas.toDataURL("image/png").split(",")[1];
    }, { background: `data:image/png;base64,${source.toString("base64")}`, displays });
    await fs.mkdir(path.dirname(spec.output), { recursive: true });
    const output = await sharp(Buffer.from(png, "base64")).resize({ width: spec.width }).webp({ quality: 91 }).toBuffer();
    await fs.writeFile(spec.output, output); reports.push({ mode, path: spec.output, bytes: output.length, ...await sharp(output).metadata() }); await page.close();
  }
  await sharp("assets/tea-pavilion/desktop-source.png").extract({ left: 680, top: 820, width: 256, height: 160 }).resize(256,256).greyscale().linear(.18,205).toColourspace("srgb").webp({ quality: 88 }).toFile("public/3d/pavilion/pavilion-stone.webp");
  const photoSources=await Promise.all([...new Set(layout.desktop.displays.map(display=>display.source))].map(async source=>({source,sha256:createHash("sha256").update(await fs.readFile(source)).digest("hex")})));
  await fs.writeFile("assets/tea-pavilion/bake-manifest.json",JSON.stringify({ approach:"Fixed-view 2.5D, precomputed architectural illumination and genuine projected photographs. Interactive models are separate.",photoSources,outputs:reports },null,2));
  console.log(reports.map(({mode,path,bytes,width,height})=>({mode,path,bytes,width,height})));
} finally { await browser.close(); }
