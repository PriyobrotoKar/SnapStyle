import { useCanvasContext } from "@/providers/CanvasProvider";
import { useEffect, useState } from "react";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import WidthControl from "./WidthControl";

const ImageSettings = () => {
  const [imgRadius, setImgRadius] = useState(20);
  const { setImageRadius, setImageStrokeWidth } = useCanvasContext();

  useEffect(() => {
    setImageRadius(imgRadius);
  }, [imgRadius, setImageRadius]);
  return (
    <div>
      <h2 className="text-sm text-muted-foreground">Image</h2>
      <Control
        property={RadiusIcon}
        value={imgRadius}
        onChange={setImgRadius}
      />
      <WidthControl setStroke={setImageStrokeWidth} defaultWidth={5} />
    </div>
  );
};

export default ImageSettings;
