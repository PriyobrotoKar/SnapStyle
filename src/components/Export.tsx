import { useRecoilValue } from "recoil";
import { Button } from "./ui/button";
import { PreviewFrameState } from "@/lib/atoms";
import domtoimage from "dom-to-image";
import { exportImage } from "@/lib/copyImage";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import showConfetti from "@/lib/confetti";

const Export = () => {
  const [pixelRatio, setPixelRatio] = useState<1 | 2>(1);
  const previewFrame = useRecoilValue(PreviewFrameState);
  const handleCopyImage = async () => {
    const toastId = toast.loading("Copying your screenshot...");
    try {
      await exportImage(previewFrame, "COPY", 2);
      toast.success("Image copied to clipboard", { id: toastId });
      showConfetti();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };
  const handleSaveImage = async () => {
    const toastId = toast.loading("Saving your screenshot...");
    try {
      await exportImage(previewFrame, "SAVE", pixelRatio);
      toast.success("Image downloaded successfully", { id: toastId });
      showConfetti();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };
  return (
    <div className="space-x-2 my-6 border flex gap-2 items-center rounded-2xl p-2 bg-card  overflow-hidden">
      <Select
        defaultValue={`${pixelRatio}x`}
        onValueChange={(val) => setPixelRatio(Number(val[0]) as 1 | 2)}
      >
        <SelectTrigger
          isArrow={false}
          className="w-14 border h-full  relative justify-end"
        >
          <span className=" absolute left-1/2 -translate-x-1/2">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1x">1x</SelectItem>
          <SelectItem value="2x">2x</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleCopyImage}
        size={"lg"}
        className="w-36"
        variant={"secondary"}
      >
        Copy
      </Button>
      <Button
        size={"lg"}
        onClick={handleSaveImage}
        className="w-36 transition-all duration-300 hover:shadow-primary/20 shadow-[0px_0px_16px_5px] shadow-transparent"
      >
        Download
      </Button>
    </div>
  );
};

export default Export;
