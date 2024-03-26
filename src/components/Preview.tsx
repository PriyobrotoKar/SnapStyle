import { useControlContext } from "@/providers/ControlCenterProvider";
import { useState } from "react";

const Preview = ({ image }: { image: string }) => {
  const [displayPreview, setDisplayPreview] = useState(false);

  const { frameRadius, frameFill } = useControlContext();
  console.log(displayPreview);

  return (
    <div
      style={{
        borderRadius: frameRadius,
        backgroundColor: frameFill,
        display: displayPreview ? "flex" : "none",
      }}
      className="max-w-[90%] justify-center items-center "
    >
      <img
        onLoad={() => setDisplayPreview(true)}
        className="w-[80%] m-20 rounded-lg border-[5px] border-red-600 shadow-[0px_10px_40px_10px_#00000070]"
        src={image}
        alt=""
      />
    </div>
  );
};

export default Preview;
