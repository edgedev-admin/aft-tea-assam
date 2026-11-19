"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ProductInspectionControls } from "./product-inspection-controls";
import { createStudioEnvironment } from "./studio-environment";
import { cinematicEase, studioCameraFraming, studioInspectionYaw, studioTransitionFrame, studioTransitionTiming } from "../../lib/tea-studio-motion";
import type { StudioCameraView, StudioModelProduct } from "../../lib/tea-studio-products";
import styles from "../../app/tea-studio/tea-studio.module.css";

function release(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    geometries.add(node.geometry);
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
    }
  });
  geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose());
  const images = new Set<{ close?: () => void }>();
  textures.forEach(texture => { if (texture.image) images.add(texture.image); texture.dispose(); });
  images.forEach(image => image.close?.());
}

type Phase = "loading" | "ready" | "error";
type Props = { product: StudioModelProduct; command: { view: StudioCameraView; serial: number }; onState: (id: string, phase: Phase) => void };
type Runtime = { load: (product: StudioModelProduct) => void; camera: (view: StudioCameraView) => void; destroy: () => void };
type Loaded = { root: THREE.Object3D; product: StudioModelProduct; size: THREE.Vector3; rest: THREE.Vector3; disposed: boolean };
type Shot = { pose: THREE.Spherical; target: THREE.Vector3 };
type SceneTransition = { started: number; outgoing: Loaded | null; incoming: Loaded; from: Shot; exit: Shot; entry: Shot; final: Shot; entered: boolean; committed: boolean; rootFrom: THREE.Vector3; yawFrom: number; edgeYaw:number; restYaw:number };

export default function ProductCanvas({ product, command, onState }: Props) {
  const host = useRef<HTMLDivElement>(null), runtime = useRef<Runtime | null>(null), currentId = useRef(product.id);
  useEffect(() => { currentId.current = product.id; }, [product.id]);
  useEffect(() => {
    const target = host.current;
    if (!target) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "default", preserveDrawingBuffer: false }); }
    catch { onState(currentId.current, "error"); return; }
    const canvas = renderer.domElement;
    canvas.setAttribute("role", "img"); canvas.setAttribute("aria-label", "Interactive Ajanta tea packaging");
    canvas.style.touchAction = "pan-y"; target.appendChild(canvas);
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(33, 1, .01, 8);
    const stableSurface=/AppleWebKit/.test(navigator.userAgent)&&!/Chrome|Chromium|Edg\/|OPR\//.test(navigator.userAgent);
    const surfacePixels=stableSurface?(target.clientWidth<768||matchMedia("(pointer:coarse)").matches?1536:2048):0;
    if(stableSurface)renderer.setDrawingBufferSize(surfacePixels,surfacePixels,1);
    const environment = createStudioEnvironment(scene, target.clientWidth < 768, invalidate);
    const museumInspection = process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).get("museum-inspect") === "environment";
    const controls = new ProductInspectionControls(camera, canvas,()=>active?.root??null,target);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true, visible = true, frame = 0, sequence = 0, lastFrame = 0, presentationFrames=0;
    let active: Loaded | null = null, pending: Loaded | null = null, abort: AbortController | null = null;
    let baseDistance = .6;
    const safeTarget = new THREE.Vector3();
    let transition: SceneTransition | null = null;
    let tween: { from: THREE.Spherical; to: THREE.Spherical; started: number; yawFrom:number; yawTo:number } | null = null;

    function invalidate() { if (alive && visible && !document.hidden && !frame) frame = requestAnimationFrame(render); }
    function fit(reset = false) {
      const size = active?.size ?? new THREE.Vector3(.18, .28, .08), before = baseDistance;
      const framing = studioCameraFraming(size, target!.clientWidth, target!.clientHeight, active?.product.scene.occupancy ?? .8, camera.fov);
      baseDistance = framing.distance;
      const pose = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      pose.radius = reset ? baseDistance : THREE.MathUtils.clamp(pose.radius * baseDistance / before, baseDistance * .84, baseDistance * 1.6);
      safeTarget.set(0, framing.targetY, 0); controls.target.copy(safeTarget);
      camera.position.copy(safeTarget).add(new THREE.Vector3().setFromSpherical(pose));
      controls.minDistance = baseDistance * .84; controls.maxDistance = baseDistance * 1.6;
      canvas.dataset.distance = baseDistance.toFixed(4);
    }
    function resize() {
      const width = target!.clientWidth, height = target!.clientHeight;
      if (!alive || !width || !height) return;
      const dpr=Math.min(devicePixelRatio || 1, width < 768 || matchMedia("(pointer:coarse)").matches ? 1.5 : 2);
      if(stableSurface){
        // WebKit can lose canvas presentation when its backing store is resized.
        // Crop one bounded surface instead; only the visible viewport is shaded.
        const ratio=Math.min(dpr,surfacePixels/width,surfacePixels/height);
        const pixelsWide=Math.round(width*ratio),pixelsHigh=Math.round(height*ratio);
        const x=Math.floor((surfacePixels-pixelsWide)/2),y=Math.floor((surfacePixels-pixelsHigh)/2);
        renderer.setViewport(x,y,pixelsWide,pixelsHigh);renderer.setScissor(x,y,pixelsWide,pixelsHigh);renderer.setScissorTest(true);
        Object.assign(canvas.style,{position:"absolute",width:`${surfacePixels/ratio}px`,height:`${surfacePixels/ratio}px`,left:`${-x/ratio}px`,top:`${-(surfacePixels-y-pixelsHigh)/ratio}px`});
        canvas.dataset.renderDpr=ratio.toFixed(3);
      }else{renderer.setDrawingBufferSize(width,height,dpr);canvas.dataset.renderDpr=String(dpr);}
      camera.aspect = width / height;camera.updateProjectionMatrix();
      if (transition) cancelTransition(true);
      environment.resize(width < 768,width,height);fit();presentationFrames=3;invalidate();
    }
    function resetCamera() {
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(new THREE.Spherical(baseDistance, Math.PI / 2 - .065, .1)));
      if(active)active.root.rotation.y=studioInspectionYaw(active.product,"reset");
      controls.update();
    }
    function discard(loaded: Loaded | null) {
      if (!loaded || loaded.disposed) return;
      loaded.disposed = true; scene.remove(loaded.root); release(loaded.root); renderer.renderLists.dispose();
    }
    function owns(root: THREE.Object3D) { return active?.root === root || pending?.root === root || transition?.incoming.root === root || transition?.outgoing?.root === root; }
    function announce(next: Loaded) {
      active = next; pending = null;
      const framing = studioCameraFraming(next.size, target!.clientWidth, target!.clientHeight, next.product.scene.occupancy);
      baseDistance = framing.distance; safeTarget.set(0, framing.targetY, 0);
      controls.minDistance = baseDistance * .84; controls.maxDistance = baseDistance * 1.6;
      canvas.dataset.model = next.product.id; canvas.setAttribute("aria-label", `Interactive ${next.product.name} packaging`);
      onState(next.product.id, "ready");
    }
    function cancelTransition(useIncoming: boolean) {
      if (!transition) return;
      const shot = transition, winner = useIncoming || shot.committed || !shot.outgoing ? shot.incoming : shot.outgoing;
      const visibleModel = shot.committed || !shot.outgoing ? shot.incoming : shot.outgoing;
      const position = visibleModel.root.position.clone(), yaw = visibleModel.root.rotation.y;
      discard(winner === shot.incoming ? shot.outgoing : shot.incoming);
      if (!winner.root.parent) scene.add(winner.root);
      winner.root.position.copy(position); winner.root.rotation.y = yaw;
      active = winner; pending = null; transition = null; environment.setProduct(winner.product);
      if (useIncoming) announce(winner);
    }
    function install(next: Loaded, time: number) {
      tween = null;
      if (reduced.matches) {
        discard(active); active = next; pending = null; scene.add(next.root); fit(true); resetCamera(); environment.setProduct(next.product, true); announce(next);return;
      }
      const framing = studioCameraFraming(next.size, target!.clientWidth, target!.clientHeight, next.product.scene.occupancy);
      const from: Shot = { pose: new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target)), target: controls.target.clone() };
      const exit: Shot = { pose: from.pose.clone(), target: from.target.clone() };
      exit.pose.radius *= 1.025; exit.pose.theta += .035;
      const theta = .1;
      const final: Shot = { pose: new THREE.Spherical(framing.distance, Math.PI / 2 - .065, exit.pose.theta + Math.atan2(Math.sin(theta - exit.pose.theta), Math.cos(theta - exit.pose.theta))), target: new THREE.Vector3(0, framing.targetY, 0) };
      const entry: Shot = { pose: final.pose.clone(), target: final.target.clone() }; entry.pose.radius *= 1.025; entry.pose.theta += .025;
      if (!active) {
        from.pose.copy(entry.pose); from.pose.theta += .04; from.target.copy(entry.target); exit.pose.copy(from.pose); exit.target.copy(from.target);
        camera.position.copy(from.target).add(new THREE.Vector3().setFromSpherical(from.pose)); controls.target.copy(from.target);
      }
      pending = next;
      const yawFrom=active?.root.rotation.y??0,edgeYaw=.1-Math.PI/2+Math.round((yawFrom-(.1-Math.PI/2))/Math.PI)*Math.PI;
      const rest=studioInspectionYaw(next.product,"reset"),restYaw=edgeYaw+Math.atan2(Math.sin(rest-edgeYaw),Math.cos(rest-edgeYaw));
      transition = { started: time - (active ? 0 : studioTransitionTiming.exit), outgoing: active, incoming: next, from, exit, entry, final, entered: false, committed: false, rootFrom: active?.root.position.clone() ?? next.rest.clone(), yawFrom,edgeYaw,restYaw };
      environment.setProduct(next.product);
    }
    function cameraBetween(from: Shot, to: Shot, amount: number) {
      const pose = new THREE.Spherical(THREE.MathUtils.lerp(from.pose.radius, to.pose.radius, amount), THREE.MathUtils.lerp(from.pose.phi, to.pose.phi, amount), THREE.MathUtils.lerp(from.pose.theta, to.pose.theta, amount));
      controls.target.copy(from.target).lerp(to.target, amount); camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(pose));
    }
    function render(time: number) {
      frame = 0;
      if (!alive || !visible || document.hidden) return;
      const dt = Math.min(.1, (time - lastFrame) / 1000 || .016); lastFrame = time;
      if (transition) {
        const shot = transition, elapsed = time - shot.started, frame = studioTransitionFrame(elapsed), ease = cinematicEase(frame.progress);
        if (frame.phase === "exit" && shot.outgoing) {
          shot.outgoing.root.position.copy(shot.rootFrom).lerp(shot.outgoing.rest.clone().add(new THREE.Vector3(.008, .001, 0)), ease);
          shot.outgoing.root.rotation.y = THREE.MathUtils.lerp(shot.yawFrom, shot.edgeYaw, ease);
          cameraBetween(shot.from, shot.exit, ease);
        } else if (frame.phase === "enter") {
          if (!shot.entered) {
            // Match the packets at their narrow edge, retaining an opaque model in
            // every rendered frame instead of superimposing two printed labels.
            discard(shot.outgoing); scene.add(shot.incoming.root); shot.entered = true;
            announce(shot.incoming); shot.committed = true;
          }
          const incoming = shot.incoming;
          incoming.root.position.copy(incoming.rest).add(new THREE.Vector3(.008 * (1 - ease), .001 * (1 - ease), 0));
          incoming.root.rotation.y = THREE.MathUtils.lerp(shot.edgeYaw,shot.restYaw,ease);
          cameraBetween(shot.exit, shot.entry, ease);
        } else {
          // A skipped animation frame must still install and announce the latest ready model.
          if (!shot.entered) scene.add(shot.incoming.root);
          if (!shot.committed) { announce(shot.incoming); shot.committed = true; }
          discard(shot.outgoing); shot.incoming.root.position.copy(shot.incoming.rest); shot.incoming.root.rotation.y = studioInspectionYaw(shot.incoming.product,"reset");
          cameraBetween(shot.entry, shot.final, ease);
          if (frame.progress === 1) transition = null;
        }
      }
      if (tween) {
        const t = Math.min(1, (time - tween.started) / 320), ease = 1 - (1 - t) ** 3;
        const pose = new THREE.Spherical(THREE.MathUtils.lerp(tween.from.radius, tween.to.radius, ease), THREE.MathUtils.lerp(tween.from.phi, tween.to.phi, ease), THREE.MathUtils.lerp(tween.from.theta, tween.to.theta, ease));
        camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(pose));if(active)active.root.rotation.y=THREE.MathUtils.lerp(tween.yawFrom,tween.yawTo,ease);if (t === 1) tween = null;
      }
      const environmental = environment.update(reduced.matches ? 1 : 1 - Math.exp(-dt * 8));
      environment.contact(active?.root.position.x ?? 0, museumInspection ? 0 : 1);
      const moving = controls.update(); renderer.render(scene, camera);
      canvas.dataset.frames = String(Number(canvas.dataset.frames ?? 0) + 1);
      canvas.dataset.textures = String(renderer.info.memory.textures); canvas.dataset.geometries = String(renderer.info.memory.geometries);
      canvas.dataset.transition = transition ? studioTransitionFrame(time - transition.started).phase : "settled";
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      canvas.dataset.triangles = String(renderer.info.render.triangles); canvas.dataset.programs = String(renderer.info.programs?.length ?? 0);
      canvas.dataset.exhibits = environment.exhibitStatus;
      canvas.dataset.cameraPose = camera.position.toArray().map(value=>value.toFixed(7)).join(",");canvas.dataset.productYaw=String(active?.root.rotation.y??0);
      presentationFrames=Math.max(0,presentationFrames-1);
      if (transition || tween || moving || environmental || presentationFrames) invalidate();
    }
    function setCamera(view: StudioCameraView) {
      if (transition) cancelTransition(true);
      if (!active) return;
      active.root.position.copy(active.rest);
      const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target)), to = from.clone();
      if (view === "zoom-in" || view === "zoom-out") to.radius = THREE.MathUtils.clamp(from.radius * (view === "zoom-in" ? .90 : 1.11), controls.minDistance, controls.maxDistance);
      else {
        to.radius = baseDistance; to.phi = Math.PI / 2 - .065;
        to.theta = .1;
      }
      const yawFrom=active.root.rotation.y,desired=view==="zoom-in"||view==="zoom-out"?yawFrom:studioInspectionYaw(active.product,view),yawTo=yawFrom+Math.atan2(Math.sin(desired-yawFrom),Math.cos(desired-yawFrom));
      if (reduced.matches) { camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(to));active.root.rotation.y=yawTo;controls.update();tween=null; }
      else tween = { from, to, started: performance.now(),yawFrom,yawTo };
      invalidate();
    }
    function start() {
      tween = null;
      if (transition) cancelTransition(true);
    }
    function end() { invalidate(); }
    function wheel(event: WheelEvent) { if (!event.ctrlKey && !event.metaKey) event.stopImmediatePropagation(); }
    function contextLost(event: Event) { event.preventDefault(); onState(currentId.current, "error"); }
    controls.addEventListener("change", invalidate); controls.addEventListener("start", start); controls.addEventListener("end", end);
    canvas.addEventListener("wheel", wheel, { capture: true, passive: true }); canvas.addEventListener("webglcontextlost", contextLost);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) invalidate(); else { cancelAnimationFrame(frame); frame = 0; } }); observer.observe(target);
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(target);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else invalidate(); };
    const motionPreference = () => {
      if (reduced.matches) {
        cancelTransition(true); tween = null;
        if (active) { active.root.position.copy(active.rest); active.root.rotation.y = 0; fit(true); resetCamera(); environment.setProduct(active.product, true); }
      }
      invalidate();
    };
    document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", motionPreference);
    runtime.current = {
      load(nextProduct) {
        const token = ++sequence; abort?.abort(); const controller = new AbortController(); abort = controller;
        cancelTransition(false);
        if (pending) { discard(pending); pending = null; }
        onState(nextProduct.id, "loading");
        const timer = setTimeout(() => controller.abort(), 20_000);
        const prepareStarted=performance.now();
        void (async () => {
          let loaded: THREE.Object3D | null = null;
          try {
            const response = await fetch(nextProduct.model, { signal: controller.signal });
            if (!response.ok) throw new Error("Model unavailable");
            const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "/3d/models/"); loaded = gltf.scene;
            if (!alive || token !== sequence || controller.signal.aborted) { release(loaded); loaded = null; if (alive && token === sequence) onState(nextProduct.id, "error"); return; }
            const bounds = new THREE.Box3().setFromObject(loaded), size = bounds.getSize(new THREE.Vector3());
            if (![size.x, size.y, size.z].every(n => Number.isFinite(n) && n > 0)) throw new Error("Invalid model bounds");
            loaded.position.sub(bounds.getCenter(new THREE.Vector3()));
            const pivot=new THREE.Group();pivot.add(loaded);loaded=pivot;
            loaded.visible = !museumInspection;
            if (!active) await environment.ready();
            if(!active&&environment.exhibitStatus==="degraded")throw new Error("Pavilion unavailable");
            if (!alive || token !== sequence || controller.signal.aborted) { release(loaded); loaded = null; return; }
            loaded.traverse(node => { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; for (const material of Array.isArray(node.material) ? node.material : [node.material]) for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy()); } });
            const seenMaterials = new Set<THREE.Material>();
            loaded.traverse(node => { if (node instanceof THREE.Mesh) for (const material of Array.isArray(node.material) ? node.material : [node.material]) seenMaterials.add(material); });
            const next: Loaded = { root: loaded, product: nextProduct, size, rest: loaded.position.clone(), disposed: false };
            // Upload maps and warm the incoming shot while the current pack remains
            // intact, rather than compiling shaders during visible motion.
            for (const material of seenMaterials) for (const value of Object.values(material)) if (value instanceof THREE.Texture) renderer.initTexture(value);
            const warmStarted=performance.now();await renderer.compileAsync(next.root, camera, scene);
            if(!alive||token!==sequence||controller.signal.aborted){release(loaded);loaded=null;return;}
            canvas.dataset.preparationMs=(performance.now()-prepareStarted).toFixed(1);canvas.dataset.warmupMs=(performance.now()-warmStarted).toFixed(1);
            install(next, performance.now());
            invalidate();
          } catch { if (loaded && !owns(loaded)) release(loaded); if (alive && token === sequence) onState(nextProduct.id, "error"); }
          finally { clearTimeout(timer); }
        })();
      },
      camera: setCamera,
      destroy() {
        alive = false; ++sequence; abort?.abort(); cancelAnimationFrame(frame); observer.disconnect(); resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", motionPreference);
        controls.dispose(); canvas.removeEventListener("wheel", wheel, true); canvas.removeEventListener("webglcontextlost", contextLost);
        discard(active); discard(pending); if (transition) { discard(transition.outgoing); discard(transition.incoming); } environment.dispose(); renderer.dispose();
        const context = renderer.getContext(); if (!context.isContextLost()) context.getExtension("WEBGL_lose_context")?.loseContext(); canvas.remove();
      },
    };
    camera.position.set(0, 0, baseDistance); environment.setProduct(product, true); resize();
    return () => { runtime.current?.destroy(); runtime.current = null; };
    // The scene persists; subsequent product changes go through the controller below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onState]);
  useEffect(() => { runtime.current?.load(product); }, [product]);
  useEffect(() => { if(command.serial)runtime.current?.camera(command.view); }, [command]);
  return <div ref={host} className={styles.canvas} />;
}
