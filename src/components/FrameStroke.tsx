import { useCanvasContext } from "@/providers/CanvasProvider";
import FillControl from "./FillControl";
import WidthControl from "./WidthControl";

const FrameStroke = () => {
  const { setStrokeFill } = useCanvasContext();
  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Stroke</h3>
      <FillControl setFill={setStrokeFill} defaultFill="#aaaaaa" />
      <WidthControl />
    </div>
  );
};

export default FrameStroke;
