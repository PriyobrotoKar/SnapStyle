import { useControlContext } from "@/providers/ControlCenterProvider";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";

const Sidebar = () => {
  const { frameRadius, setFrameRadius } = useControlContext();
  return (
    <div className="bg-violet-950/20 self-stretch w-[25rem] flex-grow-0 p-10">
      <Control
        label={RadiusIcon}
        value={frameRadius}
        onChange={setFrameRadius}
      />
    </div>
  );
};

export default Sidebar;
