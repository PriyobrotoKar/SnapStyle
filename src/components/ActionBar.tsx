"use client";

import { useCanvasContext } from "@/providers/CanvasProvider";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "./ui/button";

const ActionBar = () => {
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
      className={`flex justify-between items-center w-full max-w-screen-md `}
    >
      <ThemeSwitcher />
      <div className="flex gap-2 ">
        <Button
          className={`gap-2 `}
          variant={success ? "success" : "default"}
          onClick={copyToClipboard}
        >
          {success ? (
            <>
              Copied <Check className="w-4" />
            </>
          ) : (
            <>
              Copy <Copy className="w-4" />
            </>
          )}
        </Button>
        <Button onClick={clearCanvas} variant={"secondary"}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
