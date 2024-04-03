"use client";

import Export from "@/components/Export";
import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import { pasteImageFromClipboard } from "@/lib/pasteImage";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      event.preventDefault();
      try {
        const imageFromClipboard = await pasteImageFromClipboard();
        setImage(imageFromClipboard);
      } catch (error) {
        toast.error("Please paste an image");
      }
    };
    document.body.addEventListener("paste", handlePaste);
    return () => document.body.removeEventListener("paste", handlePaste);
  }, []);
  return (
    <div className="flex-1 flex  items-stretch">
      {!image ? (
        <h1>OK</h1>
      ) : (
        <>
          <div className="flex-1 gap-6 flex flex-col items-center justify-center">
            <Preview image={image} />
            <Export />
          </div>
          <Sidebar />
        </>
      )}
    </div>
  );
}
