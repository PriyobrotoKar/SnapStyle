"use client";

import { useCanvasContext } from "@/providers/CanvasProvider";
import { useState } from "react";
import { toast } from "sonner";
import FrameSettings from "./FrameSettings";
import ImageSettings from "./ImageSettings";
import { Separator } from "./ui/separator";

const Sidebar = () => {
  const [success, setSuccess] = useState(false);
  const { preview, canvasRef, ctx, setPreview } = useCanvasContext();
  const copyToClipboard = () => {
    if (canvasRef && canvasRef.current && preview) {
      canvasRef.current.toBlob((blob) => {
        console.log(blob);
        setSuccess(true);
        navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob as Blob }),
        ]);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      });
    } else {
      toast.error("Bro please paste a screenshot first");
    }
  };
  const clearCanvas = () => {
    if (canvasRef.current) {
      console.log("clear", ctx);
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.width = canvasRef.current.width;
      setPreview("");
    }
  };
  return (
    <div
      className={`bg-popover/50 p-4 space-y-2  self-stretch w-[20rem] rounded-xl border border-neutral-800 `}
    >
      <h1 className="text-muted-foreground">Editing Panel</h1>
      <Separator />
      <FrameSettings />
      <ImageSettings />
    </div>
  );
};

export default Sidebar;
