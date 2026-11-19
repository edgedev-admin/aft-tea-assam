import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { museumGalleries, pavilionAssets } from "../../lib/tea-museum-exhibits";
import type { StudioModelProduct } from "../../lib/tea-studio-products";

function roundedStone(width: number, depth: number, height: number) {
  const x=-width/2,y=-depth/2,r=.022,shape=new THREE.Shape();
  shape.moveTo(x+r,y);shape.lineTo(x+width-r,y);shape.quadraticCurveTo(x+width,y,x+width,y+r);
  shape.lineTo(x+width,y+depth-r);shape.quadraticCurveTo(x+width,y+depth,x+width-r,y+depth);
  shape.lineTo(x+r,y+depth);shape.quadraticCurveTo(x,y+depth,x,y+depth-r);
  shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:height,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2,curveSegments:8,steps:1});
  geometry.rotateX(-Math.PI/2);return geometry;
}

function stageGeometry() {
  const parts=[roundedStone(.30,.19,.032),roundedStone(.286,.176,.004)];
  const cap=new THREE.Color("#f7eedb"),base=new THREE.Color("#173c2c"),bronze=new THREE.Color("#aa9061"),light=new THREE.Vector3(-.35,.85,1).normalize();
  parts[0].translate(0,-.175,0);parts[1].translate(0,-.180,0);
  for(let part=0;part<parts.length;part++) {
    const geometry=parts[part],position=geometry.getAttribute("position"),normal=geometry.getAttribute("normal"),colours=new Float32Array(position.count*3),uv=new Float32Array(position.count*2),n=new THREE.Vector3();
    for(let i=0;i<position.count;i++) {
      n.fromBufferAttribute(normal,i);const height=THREE.MathUtils.clamp((position.getY(i)+.183)/.043,0,1),ambientOcclusion=normal.getY(i)>.4?1:.78+.22*height;
      const colour=(part?bronze:normal.getY(i)>.4?cap:base).clone().multiplyScalar((.75+.25*Math.max(0,n.dot(light)))*ambientOcclusion);
      colours.set([colour.r,colour.g,colour.b],i*3);uv.set([position.getX(i)/.3+.5,position.getZ(i)/.19+.5],i*2);
    }
    geometry.setAttribute("color",new THREE.BufferAttribute(colours,3));geometry.setAttribute("uv",new THREE.BufferAttribute(uv,2));geometry.clearGroups();
  }
  const geometry=mergeGeometries(parts,false);parts.forEach(part=>part.dispose());return geometry;
}

function shadowTexture() {
  const size=96,data=new Uint8Array(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
    const u=(x+.5)/size*2-1,v=(y+.5)/size*2-1,p=(y*size+x)*4;
    data[p]=18;data[p+1]=20;data[p+2]=12;data[p+3]=Math.round(110*Math.exp(-(u*u*5+v*v*7)));
  }
  const texture=new THREE.DataTexture(data,size,size);texture.needsUpdate=true;return texture;
}

export function createStudioEnvironment(scene: THREE.Scene, initialMobile: boolean, invalidate: () => void) {
  RectAreaLightUniformsLib.init();
  const root=new THREE.Group();root.name="AFT Assam Tea Pavilion";scene.add(root);
  const placeholder=new THREE.DataTexture(new Uint8Array([227,214,189,255]),1,1);placeholder.colorSpace=THREE.SRGBColorSpace;placeholder.needsUpdate=true;
  const uniforms={image:{value:placeholder as THREE.Texture},mapping:{value:new THREE.Vector2(1,1)},accent:{value:new THREE.Color("#f3d3a0")}};
  const backdropMaterial=new THREE.ShaderMaterial({
    uniforms,depthTest:false,depthWrite:false,toneMapped:false,
    vertexShader:"varying vec2 pavilionUv;void main(){pavilionUv=uv;gl_Position=vec4(position.xy,0.999,1.0);}",
    fragmentShader:`uniform sampler2D image;uniform vec2 mapping;uniform vec3 accent;varying vec2 pavilionUv;
      void main(){
        vec2 uv=vec2((pavilionUv.x-.5)*mapping.x+.5,1.-(1.-pavilionUv.y)*mapping.y);
        if(uv.y<0.)uv.y=.18-abs(mod(-uv.y,.36)-.18);
        vec3 colour=texture2D(image,clamp(uv,vec2(.001),vec2(.999))).rgb;
        vec2 pool=(pavilionUv-vec2(.5,.24))*vec2(4.,5.);
        colour*=mix(vec3(1.),accent,exp(-dot(pool,pool))*.18);
        gl_FragColor=vec4(colour,1.);
        #include <colorspace_fragment>
      }`,
  });
  const backdropGeometry=new THREE.PlaneGeometry(2,2),backdrop=new THREE.Mesh(backdropGeometry,backdropMaterial);backdrop.frustumCulled=false;backdrop.renderOrder=-100;root.add(backdrop);
  const plinthGeometry=stageGeometry(),plinthMaterial=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}),plinth=new THREE.Mesh(plinthGeometry,plinthMaterial);plinth.rotation.y=-.10;root.add(plinth);
  const contactMap=shadowTexture(),contactMaterial=new THREE.MeshBasicMaterial({map:contactMap,transparent:true,depthWrite:false,opacity:.85}),groundMaterial=contactMaterial.clone();groundMaterial.opacity=.5;
  const contactGeometry=new THREE.PlaneGeometry(.25,.13),groundGeometry=new THREE.PlaneGeometry(.38,.27);
  const contact=new THREE.Mesh(contactGeometry,contactMaterial);contact.rotation.x=-Math.PI/2;contact.position.y=-.1398;root.add(contact);
  const ground=new THREE.Mesh(groundGeometry,groundMaterial);ground.rotation.x=-Math.PI/2;root.add(ground);
  // Only the original packet uses real-time lighting. Architecture and plinth
  // have precomputed illumination; no dynamic shadow maps are rendered.
  const ambient=new THREE.HemisphereLight("#fff3df","#6c786a",.85);
  const key=new THREE.RectAreaLight("#fff1dd",4.8,.55,.75);key.position.set(-.38,.42,.63);key.lookAt(0,0,0);
  const fill=new THREE.DirectionalLight("#e5efe8",.8);fill.position.set(.42,.24,.52);
  const rim=new THREE.DirectionalLight("#f2deb8",.9);rim.position.set(.25,.4,-.4);scene.add(ambient,key,fill,rim);
  scene.background=new THREE.Color("#e3d6bd");
  let mobile=initialMobile,alive=true,sequence=0,controller:AbortController|null=null,texture:THREE.Texture|null=null,stone:THREE.Texture|null=null,ready:Promise<unknown>=Promise.resolve(),degraded=false;
  let currentMode="",width=1,height=1;const targetAccent=new THREE.Color("#f3d3a0");
  async function loadTexture(source:string,signal:AbortSignal) {
    const response=await fetch(source,{signal});if(!response.ok)throw new Error("Pavilion unavailable");
    const bitmap=await createImageBitmap(await response.blob(),{imageOrientation:"flipY",premultiplyAlpha:"none"});
    const value=new THREE.Texture(bitmap);value.flipY=false;value.colorSpace=THREE.SRGBColorSpace;value.needsUpdate=true;return value;
  }
  function disposeTexture(value:THREE.Texture|null){value?.dispose();(value?.image as {close?:()=>void}|undefined)?.close?.();}
  function mapping() {
    const image=mobile?pavilionAssets.mobile:pavilionAssets.desktop,aspect=image.width/image.height,view=width/height;
    // Portrait shows both installations. Additional screen height extends the
    // clean lower floor rather than cropping the landscape pavilion.
    if(mobile)uniforms.mapping.value.set(1,height/(width/aspect));
    else uniforms.mapping.value.set(view>aspect?1:view/aspect,view>aspect?aspect/view:1);
    const scale=mobile?.72:1;plinth.scale.set(mobile?.86:1,scale,mobile?.68:1);plinth.position.y=-.14*(1-scale);
    ground.position.y=mobile?-.174:-.181;
  }
  function load(nextMobile:boolean) {
    const mode=nextMobile?"mobile":"desktop";if(mode===currentMode)return;currentMode=mode;const token=++sequence;controller?.abort();controller=new AbortController();const signal=controller.signal;
    ready=(async()=>{
      const timer=setTimeout(()=>{if(controller?.signal===signal)controller.abort();},8000);let next:THREE.Texture|null=null;
      try {next=await loadTexture(pavilionAssets[mode].src,signal);if(!alive||token!==sequence||signal.aborted){disposeTexture(next);return;}
        if(!texture)placeholder.dispose();disposeTexture(texture);texture=next;uniforms.image.value=next;degraded=false;invalidate();
      }catch{if(alive&&token===sequence){degraded=true;currentMode="";invalidate();}}
      finally{clearTimeout(timer);}
    })();
  }
  const stoneController=new AbortController();
  void loadTexture("/3d/pavilion/pavilion-stone.webp",stoneController.signal).then(value=>{if(!alive){disposeTexture(value);return;}stone=value;plinthMaterial.map=value;plinthMaterial.needsUpdate=true;invalidate();}).catch(()=>{});
  mapping();load(mobile);
  return {
    ready:()=>ready,
    get exhibitStatus(){return degraded?"degraded":texture?"ready":"loading";},
    setProduct(product:StudioModelProduct,instant=false){targetAccent.set((museumGalleries[product.id]??museumGalleries["ajanta-gold"]).wash);if(instant)uniforms.accent.value.copy(targetAccent);},
    resize(nextMobile:boolean,nextWidth:number,nextHeight:number){mobile=nextMobile;width=nextWidth;height=nextHeight;mapping();load(mobile);},
    update(blend:number){uniforms.accent.value.lerp(targetAccent,blend);const a=uniforms.accent.value,b=targetAccent;return Math.abs(a.r-b.r)+Math.abs(a.g-b.g)+Math.abs(a.b-b.b)>.001;},
    contact(x:number,opacity=1){contact.position.x=x;contactMaterial.opacity=.85*opacity;},
    dispose(){alive=false;++sequence;controller?.abort();stoneController.abort();scene.remove(root,ambient,key,fill,rim);disposeTexture(texture);disposeTexture(stone);placeholder.dispose();contactMap.dispose();[backdropGeometry,plinthGeometry,contactGeometry,groundGeometry].forEach(item=>item.dispose());[backdropMaterial,plinthMaterial,contactMaterial,groundMaterial].forEach(item=>item.dispose());},
  };
}
