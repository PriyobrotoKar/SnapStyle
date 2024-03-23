import { useControlContext } from "@/providers/ControlCenterProvider";
import { useState } from "react";

const Preview = ({ image }: { image: string }) => {
  const [displayPreview, setDisplayPreview] = useState(false);

  const { frameRadius } = useControlContext();
  console.log(displayPreview);

  return (
    <div
      style={{
        borderRadius: frameRadius,
        display: displayPreview ? "flex" : "none",
      }}
      className="max-w-screen-lg h-[80%]  justify-center items-center bg-white"
    >
      <img
        onLoad={() => setDisplayPreview(true)}
        className="w-[80%] rounded-lg border-[5px] border-red-600 shadow-[0px_10px_40px_10px_#00000070]"
        src={image}
        alt=""
      />
    </div>
  );
};

export default Preview;
