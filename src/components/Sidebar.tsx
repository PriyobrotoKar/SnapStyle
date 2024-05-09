import FrameSettings from "./FrameSettings";
import ImageSettings from "./ImageSettings";
import TextSettings from "./TextSettings";

const Sidebar = () => {
  return (
    <div className="bg-card self-stretch space-y-8  overflow-scroll flex-grow-0 pb-8 px-8">
      <FrameSettings />
      <ImageSettings />
      <TextSettings />
    </div>
  );
};

export default Sidebar;
