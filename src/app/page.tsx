"use client";

import Export from "@/components/Export";
import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import UploadImage from "@/components/UploadImage";
import { imageSourceState } from "@/lib/atoms";
import { pasteImageFromClipboard } from "@/lib/pasteImage";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

export default function Home() {
  const [image, setImage] = useRecoilState(imageSourceState);

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
  }, [setImage]);
  return (
    <div className="flex-1 flex  items-stretch">
      {!image ? (
        <UploadImage />
      ) : (
        <>
          <div className="flex-1  flex flex-col items-center justify-center">
            <div className="flex-1 flex justify-center items-center w-full">
              <Preview />
            </div>
            <Export />
          </div>
          <Sidebar />
        </>
      )}
    </div>
  );
}
