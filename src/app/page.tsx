"use client";

import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import { useCanvasContext } from "@/providers/CanvasProvider";

export default function Home() {
  const { preview, canvasRef } = useCanvasContext();

  return (
    <div className="h-full p-10 flex gap-10 justify-center items-center">
      {/* <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[40svh] bg-secondary/50 blur-[90px] -z-10"></div> */}
      <Preview preview={preview} />
      {/* <canvas className="hidden" ref={canvasRef}></canvas> */}
      <Sidebar />
    </div>
  );
}
