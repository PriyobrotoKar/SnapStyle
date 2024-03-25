import { useState } from "react";

export default function useControlCenter() {
  const [frameRadius, setFrameRadius] = useState(20);
  const [frameFill, setFrameFill] = useState("#ffffff");

  return { frameRadius, setFrameRadius, frameFill, setFrameFill };
}
