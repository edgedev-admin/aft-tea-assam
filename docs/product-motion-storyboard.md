# Product Campaign Motion Storyboard

## Reference read

The supplied recording shows one continuous product chapter rather than a set of independent widgets. A loose multi-row image wall enters first. Vertical page travel drives opposing horizontal row movement until the central image becomes the visual anchor. That anchor grows into the viewport, after which the experience behaves like a sticky stack: each campaign physically travels upward while the next rises from below. The final panel releases into the following page section through normal document scroll.

The exact October 15 recording named in the brief was not available in the attachment directory. The locally available Wagh Bakri recording (`Recording 2026-10-14 000942.mp4`) was inspected at controlled timestamps and confirms the mosaic-to-offering composition, prominent left-side offering title, and full-viewport product treatment described in the brief.

## Desktop scroll phases

| Progress | Scene | Observable motion |
| --- | --- | --- |
| 0-18% | Editorial mosaic | Three image rows fill the viewport. The top and bottom rows drift left while the middle row drifts right. |
| 14-31% | Centre emphasis | The collection campaign stays centred while neighbouring tiles continue outward. The centre image scales and loses its border radius until it covers the stage. |
| 30-92% | Campaign stack | Five full-viewport campaigns occupy one sticky stage. Each outgoing image travels upward as the next enters from below. The left editorial rail remains stable while its product copy changes with the scene. |
| 92-100% | Release | The final Elaichi scene remains composed while the sticky container reaches its boundary and exits through ordinary page flow. The red Golden Pearl statement follows immediately. |

## Campaign order

1. AFT / Ajanta Tea Collection - bridge from mosaic to product stage.
2. Ajanta Gold - tea garden and cup campaign.
3. High Societea - palace campaign.
4. Kolkata Street Masala Chai - Kolkata street and taxi campaign.
5. Ajanta Elaichi - cardamom campaign and final release.

All other supplied campaign images appear as supporting mosaic frames. This uses the full asset set without turning fourteen near-variants into fourteen repetitive full-screen scenes.

## Responsive behavior

Below 768px the long sticky choreography is replaced by a compact two-column campaign mosaic followed by five naturally flowing 16:9 campaign scenes. This preserves pack legibility, removes scroll trapping, and keeps the next homepage section immediately reachable. The same static treatment is used for `prefers-reduced-motion` on every viewport.

## Implementation constraints

- The server-rendered homepage remains a Server Component.
- A single client leaf owns `useScroll`, `useTransform`, `useSpring`, and reduced-motion handling.
- Continuous scroll progress is represented by MotionValues, not React state or direct scroll listeners.
- Source artwork remains unchanged and is rendered with intrinsic 1920 x 1080 dimensions through `next/image`.
- No timers or autoplay logic participate in the sequence.
