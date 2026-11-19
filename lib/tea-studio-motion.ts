export const studioTransitionTiming = { exit: 260, enter: 420, settle: 260, handoff: 180 } as const;
export const studioTransitionDuration = studioTransitionTiming.exit + studioTransitionTiming.enter + studioTransitionTiming.settle;

export function studioTransitionFrame(elapsed: number) {
  const time = Math.max(0, elapsed), { exit, enter, settle, handoff } = studioTransitionTiming;
  if (time < exit) return { phase: "exit" as const, progress: time / exit, handoff: 0 };
  if (time < exit + enter) return { phase: "enter" as const, progress: (time - exit) / enter, handoff: Math.min(1, (time - exit) / handoff) };
  return { phase: "settle" as const, progress: Math.min(1, (time - exit - enter) / settle), handoff: 1 };
}

export function studioCameraFraming(size: { x: number; y: number; z: number }, width: number, height: number, occupancy: number, fovDegrees = 33) {
  const mobile = width < 768, top = mobile ? 110 : 100, bottom = mobile ? 224 : 166;
  const usable = Math.max(140, height - top - bottom), tangent = Math.tan(fovDegrees * Math.PI / 360);
  const distance = Math.max(size.y / (2 * tangent * (usable / height) * occupancy), (size.x + size.z * .35) / (2 * tangent * (width / height) * (mobile ? (height >= 740 ? .78 : .72) : .6))) + size.z / 2;
  return { distance, targetY: ((top + usable / 2) / height - .5) * 2 * distance * tangent };
}

export function studioInspectionYaw(product:{frontAzimuth:number;scene:{azimuth:number}},view:string,cameraAzimuth=.1) {
  return cameraAzimuth-product.frontAzimuth-(view==="back"?Math.PI:view==="front"?0:view==="three-quarter"?.42:product.scene.azimuth);
}

export function cinematicEase(progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  return t * t * (3 - 2 * t);
}
