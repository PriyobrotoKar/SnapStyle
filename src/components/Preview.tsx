import {
  PreviewFrameState,
  controlCenterState,
  frameDimensionState,
  frameGradientStartFillState,
  imageSourceState,
} from "@/lib/atoms";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Grains } from "./EffectSettings";
import waves from "./patterns/waves";

import "@/app/fonts.css";

const Preview = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const image = useRecoilValue(imageSourceState);
  const [___, setPreviewFrame] = useRecoilState(PreviewFrameState);
  const frameRef = useRef<HTMLDivElement>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  const {
    frameDimension,
    frameRadius,
    frameFill,
    frameStroke,
    imageStroke,
    imageRadius,
    imageRotation,
    imageScale,
    imagePosition,
    imagePerspective,
    noise,
    activeFill,
    frameGradientStartFill,
    frameGradientEndFill,
    frameGradientRotation,
    frameGradientStops,
    fillImage,
    fillImageFilter,
    fillImageTransform,
    BackdropText,
    BackdropTextColor,
    shadow,
    shadowFill,
    activeEffects,
    pattern,
    patternFill,
  } = useRecoilValue(controlCenterState);

  const getBackground = () => {
    if (!frameFill.showFill) {
      return;
    }
    if (activeFill === "solid") {
      return { background: frameFill.color };
    }

    if (activeFill === "gradient") {
      return {
        background: `linear-gradient(${frameGradientRotation}deg,${frameGradientStartFill.color} ${frameGradientStops.start}%,${frameGradientStops.mid}%,${frameGradientEndFill.color} ${frameGradientStops.end}%)`,
      };
    }
  };

  console.log(BackdropText.x, BackdropText.y);

  const getJustifyContent = () => {
    if (BackdropText.y < 50) {
      return "column";
    } else if (BackdropText.y > 50) {
      return "column-reverse";
    } else if (BackdropText.x > 50) {
      return "row-reverse";
    } else {
      return "row";
    }
  };

  const getItemAlignment = () => {
    if (BackdropText.x === 50 || BackdropText.y === 50) {
      return "center";
    }
    if (BackdropText.x < 50) {
      return "flex-start";
    } else if (BackdropText.x > 50) {
      return "flex-end";
    }
  };
  const getTextAlignment = () => {
    if (BackdropText.x === 50 || BackdropText.y === 50) {
      return "center";
    }
    if (BackdropText.x < 50) {
      return "left";
    } else if (BackdropText.x > 50) {
      return "right";
    }
  };

  const [_, setFrameDimension] = useRecoilState(frameDimensionState);

  const frameStrokePosition =
    frameStroke.position === "inside" ? "border" : "outline";
  const imageStrokePosition =
    imageStroke.position === "inside" ? "border" : "outline";

  useEffect(() => {
    if (displayPreview && frameRef.current && imageRef.current) {
      setFrameDimension({
        ...frameDimension,
        width: frameRef.current.getBoundingClientRect().width,
        height: frameRef.current.getBoundingClientRect().height,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPreview, setFrameDimension, setPreviewFrame]);

  useEffect(() => {
    if (displayPreview && frameRef.current && imageRef.current) {
      setPreviewFrame(frameRef.current);
    }
  }, [displayPreview, setPreviewFrame]);

  useEffect(() => {
    let previousWindowHeight = window.innerHeight;
    let previousWindowWidth = window.innerWidth;

    const changeDimensionOnResize = () => {
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;
      let increaseHeightAmount = (windowHeight - previousWindowHeight) / 2;
      let increaseWidthAmount = (windowWidth - previousWindowWidth) / 2;
      let wPercentage = windowWidth * 0.6;
      let hPercentage = windowHeight * 0.65;

      setFrameDimension((prev) => ({
        ...frameDimension,
        height: prev.height + increaseHeightAmount,
        width: prev.width + increaseWidthAmount,
      }));

      previousWindowHeight = windowHeight;
      previousWindowWidth = windowWidth;
    };

    if (frameDimension.isCustomDimension) {
      window.removeEventListener("resize", changeDimensionOnResize);
    } else {
      window.addEventListener("resize", changeDimensionOnResize);
    }

    return () => window.removeEventListener("resize", changeDimensionOnResize);
  }, [frameDimension, setFrameDimension]);

  console.log(
    Boolean(
      noise.enable && activeEffects.find((effect) => effect.name === "noise")
    )
  );

  return (
    <>
      <div
        ref={frameRef}
        style={{
          borderRadius: frameRadius,
          ...getBackground(),
          // backgroundColor:
          //   frameFill.showFill && activeFill === "solid" ? frameFill.color : "",

          // ...(frameDimension.width && { width: frameDimension.width }),
          // ...(frameDimension.height && { height: frameDimension.height }),
          // width: frameDimension.width || "fit-content",
          // height: frameDimension.height || "fit-content",
          [`${frameStrokePosition}Width`]: frameStroke.showFill
            ? frameStroke.width
            : 0,
          [`${frameStrokePosition}Color`]: frameStroke.color,
          [`${frameStrokePosition}Style`]: "solid",
          display: displayPreview ? "flex" : "none",
          flexDirection: getJustifyContent(),
          alignItems: getItemAlignment(),
          aspectRatio: frameDimension.width / frameDimension.height,
        }}
        className=" relative p-14 max-w-full max-h-full overflow-hidden"
      >
        <div
          style={{
            // translate: `${fillImageTransform.x}% ${fillImageTransform.y}%`,
            backgroundPosition: `${fillImageTransform.x}% ${fillImageTransform.y}%`,
            rotate: `${fillImageTransform.rotation}deg`,
            backgroundImage:
              fillImage !== "/imageFallback.svg" ? `url(${fillImage})` : "",
            backgroundRepeat: "no-repeat",
            backgroundSize: fillImage !== "/imageFallback.svg" ? "cover" : "",
            filter:
              activeFill === "image"
                ? `blur(${fillImageFilter.blur}px) brightness(${fillImageFilter.brightness}%) contrast(${fillImageFilter.contrast}%) saturate(${fillImageFilter.saturation}%)`
                : "",
          }}
          className="absolute w-full h-full inset-0"
        ></div>
        {Boolean(
          noise.enable &&
            activeEffects.find((effect) => effect.name === "noise")
        ) && (
          <div
            style={{
              scale: 100 + noise.density + "%",
              opacity: noise.opacity + "%",
            }}
            className="bg-[url('/noise.png')] w-full h-full absolute inset-0"
          ></div>
        )}
        {activeEffects.find((effect) => effect.name === "pattern") && (
          <div
            style={{
              backgroundColor: patternFill.color,
              maskImage: `url("/${pattern.type}.svg")`,
              maskSize: `${pattern.intensity}%`,
              transform: `rotate(${pattern.rotation}deg) scale(2)`,
            }}
            className="w-full h-full absolute inset-0 z-20"
          ></div>
        )}

        {BackdropText.text &&
          activeEffects.find((effect) => effect.name === "text") && (
            <div
              style={{
                fontSize: BackdropText.size + "px",
                color: BackdropTextColor.color,
                ...(BackdropText.font !== "Default" && {
                  fontFamily: BackdropText.font,
                }),
                textAlign: getTextAlignment(),
                fontWeight: BackdropText.isBold ? 700 : 400,
              }}
              className="relative z-20 flex-1"
              dangerouslySetInnerHTML={{ __html: BackdropText.text }}
            ></div>
          )}
        <img
          ref={imageRef}
          onLoad={() => {
            setDisplayPreview(true);
          }}
          style={{
            borderRadius: `${imageRadius}px`,
            rotate: `${imageRotation}deg`,
            scale: imageScale,
            translate: `${imagePosition.x}% ${imagePosition.y}%`,
            [`${imageStrokePosition}Width`]: imageStroke.showFill
              ? imageStroke.width
              : 0,
            [`${imageStrokePosition}Color`]: imageStroke.color,
            [`${imageStrokePosition}Style`]: "solid",
            width: displayPreview ? "auto" : "50vw",
            transform: `perspective(1000px) rotateX(${imagePerspective.x}deg) rotateY(${imagePerspective.y}deg)`,
            boxShadow:
              shadowFill.showFill &&
              activeEffects.find((effect) => effect.name === "shadow")
                ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px 10px ${shadowFill.color}`
                : "",
          }}
          className="aspect-auto self-center m-auto z-20 relative flex-[2_1_0%] min-w-0 block max-h-[60vh] rounded-lg"
          src={image || ""}
          alt=""
        />
      </div>
      {!displayPreview && (
        <div className="space-y-2 text-muted">
          <Loader2 className="mx-auto animate-spin " />
          <div>Loading...</div>
        </div>
      )}
    </>
  );
};

export default Preview;
