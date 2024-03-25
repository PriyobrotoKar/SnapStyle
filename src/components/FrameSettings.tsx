import { useControlContext } from "@/providers/ControlCenterProvider";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";

const FrameSettings = () => {
  const { frameRadius, setFrameRadius, frameFill, setFrameFill } =
    useControlContext();

  return (
    <div>
      <FillControl
        defaultFill={frameFill}
        onChange={setFrameFill}
        title="Fill"
      />
      <Control
        label={RadiusIcon}
        value={frameRadius}
        onChange={setFrameRadius}
      />
    </div>
  );
};

export default FrameSettings;
