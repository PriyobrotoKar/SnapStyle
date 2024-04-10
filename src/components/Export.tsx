import { useRecoilValue } from "recoil";
import { Button } from "./ui/button";
import { PreviewFrameState } from "@/lib/atoms";
import domtoimage from "dom-to-image";
import { exportImage } from "@/lib/copyImage";
import { toast } from "sonner";

const Export = () => {
  const previewFrame = useRecoilValue(PreviewFrameState);
  const handleCopyImage = async () => {
    try {
      await exportImage(previewFrame, "COPY");
      toast.success("Image copied to clipboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleSaveImage = async () => {
    try {
      await exportImage(previewFrame, "SAVE");
      toast.success("Image downloaded successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="space-x-2 my-6 border rounded-2xl p-2 bg-card  overflow-hidden">
      <Button size={"lg"} variant={"outline"}>
        1x
      </Button>
      <Button
        onClick={handleCopyImage}
        size={"lg"}
        className="w-36"
        variant={"outline"}
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
