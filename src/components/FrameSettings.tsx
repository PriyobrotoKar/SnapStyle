import { useControlContext } from "@/providers/ControlCenterProvider";
import Image from "next/image";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";
import StrokeControl from "./StrokeControl";

const FrameSettings = () => {
  const {
    frameRadius,
    setFrameRadius,
    frameFill,
    setFrameFill,
    frameStroke,
    setFrameStroke,
  } = useControlContext();
  console.log(RadiusIcon);
  return (
    <section className="space-y-4">
      <h1 className="text-lg font-medium">Frame Settings</h1>
      <Control
        label={<Image src={RadiusIcon} alt="Radius" width={12} height={12} />}
        value={frameRadius}
        onChange={setFrameRadius}
      />
      <FillControl
        defaultFill={frameFill}
        onChange={setFrameFill}
        label="Fill"
      />
      <StrokeControl />
    </section>
  );
};

export default FrameSettings;
