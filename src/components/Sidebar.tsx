import EffectSettings from "./EffectSettings";
import FrameSettings from "./FrameSettings";
import ImageSettings from "./ImageSettings";
import TextSettings from "./TextSettings";
import { motion } from "framer-motion";

const Sidebar = () => {
  return (
    <motion.div
      initial={{ left: "100%" }}
      animate={{ left: "0%" }}
      className="relative bg-card self-stretch space-y-8  overflow-y-scroll flex-grow-0 pb-8 px-8"
    >
      <FrameSettings />
      <ImageSettings />
      <EffectSettings />
    </motion.div>
  );
};

export default Sidebar;
