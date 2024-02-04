"use client";

import ActionBar from "@/components/ActionBar";
import Preview from "@/components/Preview";
import { useCanvasContext } from "@/providers/CanvasProvider";

export default function Home() {
  const { preview, canvasRef } = useCanvasContext();

  return (
    <div className="h-full p-10 flex flex-col gap-10 justify-center items-center">
      <Preview preview={preview} />
      <canvas className="hidden" ref={canvasRef}></canvas>
      <ActionBar />
    </div>
  );
}
