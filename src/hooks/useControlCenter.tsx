import { useState } from "react";

export default function useControlCenter() {
  const [frameRadius, setFrameRadius] = useState(20);
  const [frameFill, setFrameFill] = useState("#ffffff");
  const [frameStroke, setFrameStroke] = useState<{
    color: string;
    width: number;
    position: "outside" | "inside";
  }>({
    color: "#aeaeae",
    width: 5,
    position: "inside",
  });

  return {
    frameRadius,
    setFrameRadius,
    frameFill,
    setFrameFill,
    frameStroke,
    setFrameStroke,
  };
}
