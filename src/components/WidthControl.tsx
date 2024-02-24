import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Control from "./Control";

const WidthControl = ({
  setStroke,
  defaultWidth,
}: {
  setStroke: Dispatch<SetStateAction<number>>;
  defaultWidth: number;
}) => {
  const [width, setWidth] = useState(defaultWidth);

  useEffect(() => {
    setStroke(width);
  }, [width, setStroke]);
  return <Control property={"Width"} value={width} onChange={setWidth} />;
};

export default WidthControl;
