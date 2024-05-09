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
    enableNoise,
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
          width: frameDimension.width || "fit-content",
          height: frameDimension.height || "fit-content",
          [`${frameStrokePosition}Width`]: frameStroke.showFill
            ? frameStroke.width
            : 0,
          [`${frameStrokePosition}Color`]: frameStroke.color,
          [`${frameStrokePosition}Style`]: "solid",
          display: displayPreview ? "flex" : "none",
          flexDirection: getJustifyContent(),
          alignItems: getItemAlignment(),
        }}
        className=" relative p-14 overflow-hidden"
      >
        {/* <Image
          style={{
            translate: `${fillImageTransform.x}% ${fillImageTransform.y}%`,
            rotate: `${fillImageTransform.rotation}deg`,
            filter:
              activeFill === "image"
                ? `blur(${fillImageFilter.blur}px) brightness(${fillImageFilter.brightness}%) contrast(${fillImageFilter.contrast}%) saturate(${fillImageFilter.saturation}%)`
                : "",
          }}
          src={fillImage || "/imageFallback.svg"}
          alt="bgImage"
          fill
          className="absolute object-cover h-full inset-0 aspect-auto"
        /> */}
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
        {enableNoise && (
          <div className="bg-[url('/noise.png')] opacity-10 w-full h-full absolute inset-0"></div>
        )}
        <div
          style={{
            fontSize: BackdropText.size + "px",
            color: BackdropTextColor.color,
          }}
          className="relative z-20 flex-1"
        >
          {BackdropText.text}
        </div>
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
          }}
          className="aspect-auto z-20 relative flex-[2_1_0%] min-w-0 block max-h-[60vh] rounded-lg shadow-[0px_10px_40px_10px_#00000070]"
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
