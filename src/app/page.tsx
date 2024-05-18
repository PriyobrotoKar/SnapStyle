"use client";

import Export from "@/components/Export";
import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import UploadImage from "@/components/UploadImage";
import { imageSourceState } from "@/lib/atoms";
import { pasteImageFromClipboard } from "@/lib/pasteImage";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

export default function Home() {
  const image = useRecoilValue(imageSourceState);

  return (
    <div className="flex-1 flex  items-stretch  h-[80vh]">
      {!image ? (
        <UploadImage />
      ) : (
        <>
          <div className="flex-1 min-w-0 max-h-full flex flex-col items-center justify-center">
            <div className="flex-[1_0_0%] self-center px-4 min-h-0 flex justify-center items-center w-full">
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
