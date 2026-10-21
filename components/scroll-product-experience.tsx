"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  type MotionStyle,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent
} from "framer-motion";
import type { CSSProperties, RefObject } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { cloudinaryImageSrcSet } from "../lib/cloudinary-media";
import {
  campaignMosaicRows,
  campaignScenes,
  type ProductCampaignAsset
} from "../lib/product-campaigns";
import { CloudinaryImage } from "./cloudinary-image";

const sceneStarts = [0.38, 0.51, 0.64, 0.77, 0.9];

type MotionRect = {
  left: MotionValue<number>;
  top: MotionValue<number>;
  width: MotionValue<number>;
  height: MotionValue<number>;
};

type MotionTransform = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
};

function useMotionRect(): MotionRect {
  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const width = useMotionValue(1);
  const height = useMotionValue(1);
  return useMemo(() => ({ left, top, width, height }), [height, left, top, width]);
}

function useExpandedRect(
  expansion: MotionValue<number>,
  source: MotionRect,
  centre: MotionRect,
  stageWidth: MotionValue<number>,
  stageHeight: MotionValue<number>
): MotionRect {
  const left = useTransform(
    [expansion, source.left, centre.left, centre.width, stageWidth],
    ([amount, start, centreStart, centreSize, stageSize]) => {
      const scale = Number(stageSize) / Math.max(1, Number(centreSize));
      const target = (Number(start) - Number(centreStart)) * scale;
      return Math.round(Number(start) + (target - Number(start)) * Number(amount));
    }
  );
  const top = useTransform(
    [expansion, source.top, centre.top, centre.height, stageHeight],
    ([amount, start, centreStart, centreSize, stageSize]) => {
      const scale = Number(stageSize) / Math.max(1, Number(centreSize));
      const target = (Number(start) - Number(centreStart)) * scale;
      return Math.round(Number(start) + (target - Number(start)) * Number(amount));
    }
  );
  const width = useTransform(
    [expansion, source.width, centre.width, stageWidth],
    ([amount, start, centreSize, stageSize]) => {
      const target = Number(start) * Number(stageSize) / Math.max(1, Number(centreSize));
      return Math.round(Number(start) + (target - Number(start)) * Number(amount));
    }
  );
  const height = useTransform(
    [expansion, source.height, centre.height, stageHeight],
    ([amount, start, centreSize, stageSize]) => {
      const target = Number(start) * Number(stageSize) / Math.max(1, Number(centreSize));
      return Math.round(Number(start) + (target - Number(start)) * Number(amount));
    }
  );

  return useMemo(() => ({ left, top, width, height }), [height, left, top, width]);
}

function useExpandedTransform(
  expansion: MotionValue<number>,
  source: MotionRect,
  centre: MotionRect,
  stageWidth: MotionValue<number>,
  stageHeight: MotionValue<number>
): MotionTransform {
  const scaleX = useTransform(
    [expansion, centre.width, stageWidth],
    ([amount, centreSize, stageSize]) =>
      1 + (Number(stageSize) / Math.max(1, Number(centreSize)) - 1) * Number(amount)
  );
  const scaleY = useTransform(
    [expansion, centre.height, stageHeight],
    ([amount, centreSize, stageSize]) =>
      1 + (Number(stageSize) / Math.max(1, Number(centreSize)) - 1) * Number(amount)
  );
  const x = useTransform(
    [expansion, source.left, centre.left, centre.width, stageWidth],
    ([amount, start, centreStart, centreSize, stageSize]) => {
      const target = (Number(start) - Number(centreStart)) * Number(stageSize) /
        Math.max(1, Number(centreSize));
      return Math.round((target - Number(start)) * Number(amount));
    }
  );
  const y = useTransform(
    [expansion, source.top, centre.top, centre.height, stageHeight],
    ([amount, start, centreStart, centreSize, stageSize]) => {
      const target = (Number(start) - Number(centreStart)) * Number(stageSize) /
        Math.max(1, Number(centreSize));
      return Math.round((target - Number(start)) * Number(amount));
    }
  );

  return useMemo(() => ({ x, y, scaleX, scaleY }), [scaleX, scaleY, x, y]);
}

function CampaignPicture({
  asset,
  alt,
  priority = false,
  sizes = "100vw",
  mobileArtDirection = false
}: {
  asset: ProductCampaignAsset;
  alt: string;
  priority?: boolean;
  sizes?: string;
  mobileArtDirection?: boolean;
}) {
  return (
    <picture>
      {mobileArtDirection && asset.mobileScene && (
        <source
          media="(max-width: 700px)"
          sizes="100vw"
          srcSet={cloudinaryImageSrcSet(asset.mobileScene.src, [390, 540, 780])}
        />
      )}
      <CloudinaryImage
        src={asset.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
      />
    </picture>
  );
}

function CampaignScene({
  asset,
  index,
  progress
}: {
  asset: ProductCampaignAsset;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = sceneStarts[index];
  const isFirst = index === 0;
  const isLast = index === campaignScenes.length - 1;
  const input = isFirst
    ? [0, start, start + 0.08, start + 0.13]
    : isLast
      ? [start - 0.13, start, 1]
      : [start - 0.13, start, start + 0.08, start + 0.13];
  const output = isFirst
    ? ["0%", "0%", "0%", "-100%"]
    : isLast
      ? ["100%", "0%", "0%"]
      : ["100%", "0%", "0%", "-100%"];
  const y = useTransform(progress, input, output);
  const sceneStyle = {
    y,
    zIndex: index + 1,
    "--scene-position-desktop": `${asset.desktopFocalPoint.x} ${asset.desktopFocalPoint.y}`,
    "--scene-position-mobile": `${asset.mobileFocalPoint.x} ${asset.mobileFocalPoint.y}`,
    "--scene-mobile-fit": asset.mobileScene?.fit ?? "cover",
    "--scene-mobile-background": asset.mobileScene?.background ?? "#082219"
  } as unknown as MotionStyle & CSSProperties;

  return (
    <motion.article
      className="product-motion-scene"
      style={sceneStyle}
      data-campaign={asset.id}
    >
      <div
        className="product-motion-scene__media"
        style={{
          "--scene-position-desktop": `${asset.desktopFocalPoint.x} ${asset.desktopFocalPoint.y}`,
          "--scene-position-mobile": `${asset.mobileFocalPoint.x} ${asset.mobileFocalPoint.y}`
        } as CSSProperties}
      >
        <CampaignPicture
          asset={asset}
          alt={asset.alt}
          mobileArtDirection
        />
        <div className="product-motion-scene__veil" />
      </div>
      <div className="product-motion-scene__rail">
        <h3>{asset.product}</h3>
        <span>{String(index + 1).padStart(2, "0")} / {String(campaignScenes.length).padStart(2, "0")}</span>
        <Link href={asset.productUrl}>
          Discover this tea <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </motion.article>
  );
}

function MotionDebug({ progress }: { progress: MotionValue<number> }) {
  const readoutRef = useRef<HTMLSpanElement>(null);
  const entry = useTransform(progress, [0, 0.15], [0, 1]);
  const mosaic = useTransform(progress, [0, 0.3], [0, 1]);
  const expansion = useTransform(progress, [0.14, 0.36], [0, 1]);
  const scenes = useTransform(progress, [0.38, 0.96], [0, 1]);
  const meters: Array<[string, MotionValue<number>]> = [
    ["Entry", entry],
    ["Rows", mosaic],
    ["Expand", expansion],
    ["Scenes", scenes]
  ];

  useMotionValueEvent(progress, "change", (latest) => {
    if (!readoutRef.current) return;
    const sceneIndex = Math.min(
      campaignScenes.length - 1,
      Math.max(0, Math.floor((latest - sceneStarts[0]) / 0.13))
    );
    const phase = latest < 0.14
      ? "mosaic"
      : latest < sceneStarts[0]
        ? "expansion"
        : campaignScenes[sceneIndex].product;
    readoutRef.current.textContent = `${latest.toFixed(3)} · ${phase}`;
  });

  return (
    <aside className="product-motion-debug" aria-hidden="true">
      <b>Motion timeline</b>
      <span ref={readoutRef}>0.000 · mosaic</span>
      {meters.map(([label, value]) => (
        <div className="product-motion-debug__meter" key={label}>
          {label}<i><motion.em style={{ scaleX: value }} /></i>
        </div>
      ))}
    </aside>
  );
}

function MosaicRow({
  row,
  x,
  opacity
}: {
  row: ProductCampaignAsset[];
  x: MotionValue<string>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div className="product-motion-row" style={{ x, opacity }} aria-hidden="true">
      {row.map((asset, index) => (
        <figure className={index % 3 === 1 ? "is-wide" : ""} key={`${asset.id}-${index}`}>
          <CloudinaryImage
            src={asset.src}
            alt=""
            fill
            sizes="(max-width: 1200px) 42vw, 31vw"
            style={{ objectFit: "cover", objectPosition: `${asset.desktopFocalPoint.x} ${asset.desktopFocalPoint.y}` }}
          />
        </figure>
      ))}
    </motion.div>
  );
}

function FeatureMosaicSlots({
  row,
  slotRefs
}: {
  row: ProductCampaignAsset[];
  slotRefs: ReadonlyArray<RefObject<HTMLDivElement | null>>;
}) {
  return (
    <div className="product-motion-row product-motion-row--feature" aria-hidden="true">
      <div className="product-motion-feature-track">
        {row.map((asset, index) => (
          <div
            className={`product-motion-feature-slot${index === 2 ? " is-centre" : index % 3 === 1 ? " is-wide" : ""}`}
            ref={slotRefs[index]}
            key={`${asset.id}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureExpansionLayer({
  row,
  sources,
  centreRect,
  transforms,
  opacity,
  geometryReady
}: {
  row: ProductCampaignAsset[];
  sources: MotionRect[];
  centreRect: MotionRect;
  transforms: ReadonlyArray<MotionTransform | null>;
  opacity: MotionValue<number>;
  geometryReady: boolean;
}) {
  return (
    <motion.div
      className="product-motion-feature-layer"
      style={{ opacity, visibility: geometryReady ? "visible" : "hidden" }}
      data-render-strategy="unified-layout-resize"
      aria-hidden="true"
    >
      {row.map((asset, index) => {
        const transform = transforms[index];
        return <motion.figure
          className={`product-motion-feature-tile${index === 2 ? " is-centre" : ""}`}
          style={{
            left: transform ? sources[index].left : centreRect.left,
            top: transform ? sources[index].top : centreRect.top,
            width: transform ? sources[index].width : centreRect.width,
            height: transform ? sources[index].height : centreRect.height,
            x: transform?.x,
            y: transform?.y,
            scaleX: transform?.scaleX,
            scaleY: transform?.scaleY,
            "--feature-position": `${asset.desktopFocalPoint.x} ${asset.desktopFocalPoint.y}`,
            "--feature-background": asset.mobileScene?.background ?? "#f8f6f1"
          } as unknown as MotionStyle & CSSProperties}
          data-feature-tile={asset.id}
          key={`${asset.id}-${index}`}
        >
          <CampaignPicture
            asset={asset}
            alt=""
            mobileArtDirection={index === 2}
            sizes={index === 2 ? "100vw" : "(max-width: 700px) 94vw, 34vw"}
          />
        </motion.figure>
      })}
    </motion.div>
  );
}

export function ScrollProductExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const featureSlotOneRef = useRef<HTMLDivElement>(null);
  const featureSlotTwoRef = useRef<HTMLDivElement>(null);
  const featureSlotThreeRef = useRef<HTMLDivElement>(null);
  const featureSlotFourRef = useRef<HTMLDivElement>(null);
  const featureSlotFiveRef = useRef<HTMLDivElement>(null);
  const featureSlotRefs = useMemo(() => [
    featureSlotOneRef,
    featureSlotTwoRef,
    featureSlotThreeRef,
    featureSlotFourRef,
    featureSlotFiveRef
  ], []);
  const featureStartOne = useMotionRect();
  const featureStartTwo = useMotionRect();
  const featureStartThree = useMotionRect();
  const featureStartFour = useMotionRect();
  const featureStartFive = useMotionRect();
  const featureStarts = useMemo(() => [
    featureStartOne,
    featureStartTwo,
    featureStartThree,
    featureStartFour,
    featureStartFive
  ], [
    featureStartFive,
    featureStartFour,
    featureStartOne,
    featureStartThree,
    featureStartTwo
  ]);
  const stageWidth = useMotionValue(1);
  const stageHeight = useMotionValue(1);
  const [geometryReady, setGeometryReady] = useState(false);
  const [useMobileTransforms, setUseMobileTransforms] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });
  const progress = scrollYProgress;
  const expansionProgress = useTransform(progress, [0.14, 0.36], [0, 1]);
  const featureRectThree = useExpandedRect(
    expansionProgress,
    featureStartThree,
    featureStartThree,
    stageWidth,
    stageHeight
  );
  const featureTransformOne = useExpandedTransform(expansionProgress, featureStartOne, featureStartThree, stageWidth, stageHeight);
  const featureTransformTwo = useExpandedTransform(expansionProgress, featureStartTwo, featureStartThree, stageWidth, stageHeight);
  const featureTransformThree = useExpandedTransform(expansionProgress, featureStartThree, featureStartThree, stageWidth, stageHeight);
  const featureTransformFour = useExpandedTransform(expansionProgress, featureStartFour, featureStartThree, stageWidth, stageHeight);
  const featureTransformFive = useExpandedTransform(expansionProgress, featureStartFive, featureStartThree, stageWidth, stageHeight);
  const featureTransforms = useMemo(() => [
    featureTransformOne,
    featureTransformTwo,
    useMobileTransforms ? featureTransformThree : null,
    featureTransformFour,
    featureTransformFive
  ], [featureTransformFive, featureTransformFour, featureTransformOne, featureTransformThree, featureTransformTwo, useMobileTransforms]);

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setUseMobileTransforms(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const sticky = stickyRef.current;
    const slots = featureSlotRefs.map((ref) => ref.current);
    if (!sticky || slots.some((slot) => !slot)) return;

    const measure = () => {
      const stageRect = sticky.getBoundingClientRect();
      slots.forEach((slot, index) => {
        if (!slot) return;
        const slotRect = slot.getBoundingClientRect();
        const start = featureStarts[index];
        start.left.set(Math.round(slotRect.left - stageRect.left));
        start.top.set(Math.round(slotRect.top - stageRect.top));
        start.width.set(Math.round(slotRect.width));
        start.height.set(Math.round(slotRect.height));
      });
      stageWidth.set(Math.round(stageRect.width));
      stageHeight.set(Math.round(stageRect.height));
      setGeometryReady(true);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sticky);
    slots.forEach((slot) => {
      if (slot) observer.observe(slot);
    });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [featureSlotRefs, featureStarts, stageHeight, stageWidth]);

  const rowOneX = useTransform(progress, [0, 0.3], ["0vw", "-31vw"]);
  const rowThreeX = useTransform(progress, [0, 0.3], ["-2vw", "-34vw"]);
  const surroundingsOpacity = useTransform(progress, [0, 0.28, 0.36], [1, 1, 0]);
  const featureLayerOpacity = useTransform(progress, [0, 0.36, 0.38], [1, 1, 0]);
  const sceneLayerOpacity = useTransform(progress, [0, 0.359, 0.36], [0, 0, 1]);
  const collectionMobileStyle = {
    "--scene-mobile-fit": campaignScenes[0].mobileScene?.fit ?? "cover",
    "--scene-mobile-background": campaignScenes[0].mobileScene?.background ?? "#082219"
  } as CSSProperties;
  const featureRow = campaignMosaicRows[1];

  return (
    <section ref={sectionRef} className="product-motion" aria-label="Ajanta Tea product collection">
      <div className="product-motion-live" aria-hidden={reduceMotion ? "true" : undefined}>
        <div className="product-motion-sticky" ref={stickyRef} style={collectionMobileStyle}>
          <div className="product-motion-mosaic">
            <MosaicRow row={campaignMosaicRows[0]} x={rowOneX} opacity={surroundingsOpacity} />
            <FeatureMosaicSlots row={featureRow} slotRefs={featureSlotRefs} />
            <MosaicRow row={campaignMosaicRows[2]} x={rowThreeX} opacity={surroundingsOpacity} />
          </div>

          <FeatureExpansionLayer
            row={featureRow}
            sources={featureStarts}
            centreRect={featureRectThree}
            transforms={featureTransforms}
            opacity={featureLayerOpacity}
            geometryReady={geometryReady}
          />

          <motion.div className="product-motion-scenes" style={{ opacity: sceneLayerOpacity }}>
            {campaignScenes.map((asset, index) => (
              <CampaignScene asset={asset} index={index} progress={progress} key={asset.id} />
            ))}
          </motion.div>
          {process.env.NODE_ENV === "development" && <MotionDebug progress={progress} />}
        </div>
      </div>

      <div className="product-motion-static" aria-hidden={reduceMotion ? undefined : "true"}>
        <div className="product-motion-static__mosaic" aria-hidden="true">
          {productCampaignMobileMosaic.map((asset, index) => (
            <figure className={index === 0 ? "is-featured" : ""} key={asset.id}>
              <CloudinaryImage src={asset.src} alt="" fill sizes="(max-width: 520px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </figure>
          ))}
        </div>
        <div className="product-motion-static__scenes">
          {campaignScenes.map((asset, index) => (
            <article key={asset.id}>
              <figure
                style={{
                  "--scene-mobile-fit": asset.mobileScene?.fit ?? "cover",
                  "--scene-mobile-background": asset.mobileScene?.background ?? "#082219"
                } as CSSProperties}
              >
                <CampaignPicture
                  asset={asset}
                  alt={asset.alt}
                  mobileArtDirection
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{asset.product}</h3>
                <Link href={asset.productUrl} aria-label={`Explore ${asset.product}`}>
                  <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const productCampaignMobileMosaic = [
  campaignScenes[0],
  campaignMosaicRows[0][0],
  campaignMosaicRows[1][0],
  campaignMosaicRows[2][0],
  campaignMosaicRows[0][3]
];
