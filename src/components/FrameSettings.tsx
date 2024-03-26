import { useControlContext } from "@/providers/ControlCenterProvider";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";

const FrameSettings = () => {
  const { frameRadius, setFrameRadius, frameFill, setFrameFill } =
    useControlContext();

  return (
    <section>
      <h1 className="text-lg font-medium">Frame Settings</h1>
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
    </section>
  );
};

export default FrameSettings;
