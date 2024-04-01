import { controlCenterState, frameDimensionState } from "@/lib/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const Preview = ({ image }: { image: string }) => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const {
    frameDimension,
    frameRadius,
    frameFill,
    frameStroke,
    imageStroke,
    imageRadius,
    imageRotation,
    imageScale,
  } = useRecoilValue(controlCenterState);

  const [_, setFrameDimension] = useRecoilState(frameDimensionState);

  const frameStrokePosition =
    frameStroke.position === "inside" ? "border" : "outline";
  const imageStrokePosition =
    imageStroke.position === "inside" ? "border" : "outline";

  console.log(frameDimension.width || "70");

  useEffect(() => {
    if (displayPreview && frameRef.current) {
      setFrameDimension({
        width: frameRef.current.getBoundingClientRect().width,
        height: frameRef.current.getBoundingClientRect().height,
      });
    }
  }, [displayPreview, setFrameDimension]);

  return (
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
      className=" max-w-[90%] max-h-[90%] h-auto justify-center items-center p-20 overflow-hidden"
    >
      <img
        onLoad={() => {
          setDisplayPreview(true);
        }}
        style={{
          borderRadius: `${imageRadius}px`,
          rotate: `${imageRotation}deg`,
          scale: imageScale,
          [`${imageStrokePosition}Width`]:
            imageStroke.color === "" ? 0 : imageStroke.width,
          [`${imageStrokePosition}Color`]: imageStroke.color,
          [`${imageStrokePosition}Style`]: "solid",
        }}
        className="w-full max-w-[50vw]  rounded-lg shadow-[0px_10px_40px_10px_#00000070]"
        src={image}
        alt=""
      />
    </div>
  );
};

export default Preview;
