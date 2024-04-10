import {
  PreviewFrameState,
  controlCenterState,
  frameDimensionState,
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
  } = useRecoilValue(controlCenterState);

  const [_, setFrameDimension] = useRecoilState(frameDimensionState);

  const frameStrokePosition =
    frameStroke.position === "inside" ? "border" : "outline";
  const imageStrokePosition =
    imageStroke.position === "inside" ? "border" : "outline";

  console.log(frameDimension.width || "70");

  useEffect(() => {
    if (displayPreview && frameRef.current && imageRef.current) {
      setFrameDimension({
        width: frameRef.current.getBoundingClientRect().width,
        height: frameRef.current.getBoundingClientRect().height,
      });
    }
  }, [displayPreview, setFrameDimension, setPreviewFrame]);

  useEffect(() => {
    if (displayPreview && frameRef.current && imageRef.current) {
      console.log(frameRef.current.clientWidth);
      setPreviewFrame(frameRef.current);
    }
  }, [displayPreview, setPreviewFrame]);

  return (
    <>
      <div
        ref={frameRef}
        style={{
          borderRadius: frameRadius,
          backgroundColor: frameFill,
          // ...(frameDimension.width && { width: frameDimension.width }),
          // ...(frameDimension.height && { height: frameDimension.height }),
          width: frameDimension.width || "fit-content",
          height: frameDimension.height || "fit-content",
          [`${frameStrokePosition}Width`]:
            frameStroke.color === "" ? 0 : frameStroke.width,
          [`${frameStrokePosition}Color`]: frameStroke.color,
          [`${frameStrokePosition}Style`]: "solid",
          display: displayPreview ? "flex" : "none",
        }}
        className=" relative   justify-center items-center p-14 overflow-hidden"
      >
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
            [`${imageStrokePosition}Width`]:
              imageStroke.color === "" ? 0 : imageStroke.width,
            [`${imageStrokePosition}Color`]: imageStroke.color,
            [`${imageStrokePosition}Style`]: "solid",
          }}
          className="aspect-auto max-w-[50vw] max-h-[60vh] rounded-lg shadow-[0px_10px_40px_10px_#00000070]"
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
