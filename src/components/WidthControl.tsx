import { useCanvasContext } from "@/providers/CanvasProvider";
import { ChangeEvent, useEffect, useState } from "react";
import Control from "./Control";

const WidthControl = () => {
  const [width, setwidth] = useState(50);
  const handleWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setwidth(Number(e.target.value));
  };
  const { setStrokeWidth } = useCanvasContext();

  useEffect(() => {
    setStrokeWidth(width);
  }, [width, setStrokeWidth]);
  return <Control property={"Width"} value={width} onChange={setwidth} />;
};

export default WidthControl;
