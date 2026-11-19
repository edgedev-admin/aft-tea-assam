import * as THREE from "three";

// Input changes only the packet pivot. Camera position changes only for zoom;
// there is no orbit, pan, inertia loop or second animation controller.
export class ProductInspectionControls extends THREE.EventDispatcher<{change:object;start:object;end:object}> {
  target=new THREE.Vector3();minDistance=.1;maxDistance=2;
  private pointers=new Map<number,{x:number;y:number}>();
  constructor(private camera:THREE.PerspectiveCamera,private canvas:HTMLCanvasElement,private pivot:()=>THREE.Object3D|null,private viewport:HTMLElement) {
    super();canvas.addEventListener("pointerdown",this.down);canvas.addEventListener("pointermove",this.move);
    canvas.addEventListener("pointerup",this.up);canvas.addEventListener("pointercancel",this.up);canvas.addEventListener("lostpointercapture",this.up);
    canvas.addEventListener("wheel",this.wheel,{passive:false});
  }
  private down=(event:PointerEvent)=>{
    if(event.button!==0&&event.pointerType==="mouse")return;
    this.dispatchEvent({type:"start"});this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});this.canvas.setPointerCapture(event.pointerId);
  };
  private move=(event:PointerEvent)=>{
    const previous=this.pointers.get(event.pointerId);if(!previous)return;
    const before=[...this.pointers.values()];this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});const after=[...this.pointers.values()];
    if(after.length===2) {
      const distance=(p:{x:number;y:number}[])=>Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
      this.zoom(distance(before)/Math.max(1,distance(after)));
    } else if(after.length===1) {
      const root=this.pivot();if(root){const yaw=root.rotation.y+(event.clientX-previous.x)/this.viewport.clientWidth*Math.PI*2;root.rotation.y=Math.atan2(Math.sin(yaw),Math.cos(yaw));this.dispatchEvent({type:"change"});}
    }
  };
  private up=(event:PointerEvent)=>{
    if(!this.pointers.delete(event.pointerId))return;
    if(this.canvas.hasPointerCapture(event.pointerId))this.canvas.releasePointerCapture(event.pointerId);
    if(!this.pointers.size)this.dispatchEvent({type:"end"});
  };
  private wheel=(event:WheelEvent)=>{
    if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();this.dispatchEvent({type:"start"});this.zoom(Math.exp(event.deltaY*.002));this.dispatchEvent({type:"end"});
  };
  private zoom(factor:number){
    const offset=this.camera.position.clone().sub(this.target),radius=offset.length();
    offset.multiplyScalar(THREE.MathUtils.clamp(radius*factor,this.minDistance,this.maxDistance)/radius);this.camera.position.copy(this.target).add(offset);this.dispatchEvent({type:"change"});
  }
  update(){this.camera.lookAt(this.target);this.camera.updateMatrixWorld();return false;}
  dispose(){
    this.canvas.removeEventListener("pointerdown",this.down);this.canvas.removeEventListener("pointermove",this.move);this.canvas.removeEventListener("pointerup",this.up);
    this.canvas.removeEventListener("pointercancel",this.up);this.canvas.removeEventListener("lostpointercapture",this.up);this.canvas.removeEventListener("wheel",this.wheel);this.pointers.clear();
  }
}
