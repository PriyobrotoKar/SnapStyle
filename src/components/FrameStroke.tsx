import { useCanvasContext } from "@/providers/CanvasProvider";
import FillControl from "./FillControl";
import WidthControl from "./WidthControl";

const FrameStroke = () => {
  const { setStrokeFill, setStrokeWidth } = useCanvasContext();
  return (
    <div>
      <FillControl
        title="Stroke"
        setFill={setStrokeFill}
        defaultFill="#aaaaaa"
      />
      <WidthControl setStroke={setStrokeWidth} defaultWidth={20} />
    </div>
  );
};

export default FrameStroke;
