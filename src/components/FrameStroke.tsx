import { useCanvasContext } from "@/providers/CanvasProvider";
import FillControl from "./FillControl";
import WidthControl from "./WidthControl";

const FrameStroke = () => {
  const { setStrokeFill, setStrokeWidth } = useCanvasContext();
  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Stroke</h3>
      <FillControl setFill={setStrokeFill} defaultFill="#aaaaaa" />
      <WidthControl setStroke={setStrokeWidth} defaultWidth={20} />
    </div>
  );
};

export default FrameStroke;
