import { useCanvasContext } from "@/providers/CanvasProvider";
import { useEffect, useState } from "react";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";
import WidthControl from "./WidthControl";

const ImageSettings = () => {
  const [imgRadius, setImgRadius] = useState(10);
  const [imgScale, setImgScale] = useState(100);
  const {
    setImageRadius,
    setImageStrokeWidth,
    setImageStrokeFill,
    setImageScale,
  } = useCanvasContext();

  useEffect(() => {
    setImageRadius(imgRadius);
  }, [imgRadius, setImageRadius]);
  useEffect(() => {
    setImageScale(imgScale);
  }, [imgScale, setImageScale]);
  return (
    <div>
      <h2 className="text-sm text-muted-foreground">Image</h2>
      <Control property={"Scale"} value={imgScale} onChange={setImgScale} />
      <Control
        property={RadiusIcon}
        value={imgRadius}
        onChange={setImgRadius}
      />
      <FillControl setFill={setImageStrokeFill} defaultFill="#6891af" />
      <WidthControl setStroke={setImageStrokeWidth} defaultWidth={5} />
    </div>
  );
};

export default ImageSettings;
