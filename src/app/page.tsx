"use client";

import Export from "@/components/Export";
import Loader from "@/components/Loader";
import Preview from "@/components/Preview";
import Sidebar from "@/components/Sidebar";
import UploadImage from "@/components/UploadImage";
import { imageSourceState } from "@/lib/atoms";
import { pasteImageFromClipboard } from "@/lib/pasteImage";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

export default function Home() {
  const image = useRecoilValue(imageSourceState);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      router.replace("/coming-soon");
    }
  }, []);

  return (
    <div className="flex-1 flex  items-stretch relative  h-[80vh]">
      {isLoading && <Loader />}
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
