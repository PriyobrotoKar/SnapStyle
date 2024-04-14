import FrameSettings from "./FrameSettings";
import ImageSettings from "./ImageSettings";

const Sidebar = () => {
  return (
    <div className="bg-card self-stretch space-y-8  flex-grow-0 px-8">
      <FrameSettings />
      <ImageSettings />
    </div>
  );
};

export default Sidebar;
