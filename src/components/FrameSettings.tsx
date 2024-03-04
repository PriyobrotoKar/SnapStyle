import { useCanvasContext } from "@/providers/CanvasProvider";
import { useEffect, useState } from "react";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";
import FrameStroke from "./FrameStroke";

const FrameSettings = () => {
  const [canvasRadius, setCanvasRadius] = useState(20);
  const { setFrameRadius } = useCanvasContext();
  const { ctx, canvasRef, setBgFill } = useCanvasContext();

  useEffect(() => {
    setFrameRadius(canvasRadius);
  }, [canvasRadius, setFrameRadius]);

  return (
    <div>
      <h2 className="text-sm text-muted-foreground">Frame</h2>
      <Control
        property={RadiusIcon}
        value={canvasRadius}
        onChange={setCanvasRadius}
      />
      <FrameStroke />
      <FillControl title="Fill" setFill={setBgFill} defaultFill="#ffffff" />
    </div>
  );
};

export default FrameSettings;
