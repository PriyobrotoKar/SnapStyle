import { controlCenterState, frameDimensionState } from "@/lib/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const Preview = ({ image }: { image: string }) => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const { frameDimension, frameRadius, frameFill, frameStroke } =
    useRecoilValue(controlCenterState);

  const [_, setFrameDimension] = useRecoilState(frameDimensionState);

  const strokePosition =
    frameStroke.position === "inside" ? "border" : "outline";

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
        [`${strokePosition}Width`]: frameStroke.width,
        [`${strokePosition}Color`]: frameStroke.color,
        [`${strokePosition}Style`]: "solid",
        display: displayPreview ? "flex" : "none",
      }}
      className=" max-w-[90%] max-h-[90%] h-auto justify-center items-center p-20"
    >
      <img
        onLoad={() => {
          setDisplayPreview(true);
        }}
        className="w-full max-w-[50vw]  rounded-lg border-[5px] border-red-600 shadow-[0px_10px_40px_10px_#00000070]"
        src={image}
        alt=""
      />
    </div>
  );
};

export default Preview;
