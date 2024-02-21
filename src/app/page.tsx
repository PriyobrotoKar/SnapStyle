"use client";

import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import { useCanvasContext } from "@/providers/CanvasProvider";

export default function Home() {
  const { preview, canvasRef } = useCanvasContext();

  return (
    <div className="h-full p-10 flex gap-10 justify-center items-center">
      <Preview preview={preview} />
      {/* <canvas className="hidden" ref={canvasRef}></canvas> */}
      <Sidebar />
    </div>
  );
}
