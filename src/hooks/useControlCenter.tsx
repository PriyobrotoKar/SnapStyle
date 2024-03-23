import { useState } from "react";

export default function useControlCenter() {
  const [frameRadius, setFrameRadius] = useState(20);

  return { frameRadius, setFrameRadius };
}
