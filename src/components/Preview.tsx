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
  } = useRecoilValue(controlCenterState);

  const getBackground = () => {
    if (!frameFill.showFill) {
      return;
    }
    if (activeFill === "solid") {
      console.log(activeFill);
      return { background: frameFill.color };
    }

    if (activeFill === "gradient") {
      return {
        background: `linear-gradient(${frameGradientRotation}deg,${frameGradientStartFill.color} ${frameGradientStops.start}%,${frameGradientStops.mid}%,${frameGradientEndFill.color} ${frameGradientStops.end}%)`,
      };
    }
    if (activeFill === "image") {
      console.log(activeFill);
      return {
        backgroundImage: `url(${fillImage})`,
        backgroundSize: fillImage !== "/imageFallback.svg" ? "cover" : "",
      };
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
          // backgroundColor:
          //   frameFill.showFill && activeFill === "solid" ? frameFill.color : "",
          ...getBackground(),
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
        }}
        className=" relative   justify-center items-center p-14 overflow-hidden"
      >
        {enableNoise && (
          <div className="bg-[url('/noise.png')] opacity-10 w-full h-full absolute inset-0"></div>
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
          }}
          className="aspect-auto  max-h-[60vh] rounded-lg shadow-[0px_10px_40px_10px_#00000070]"
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
