import { imageSourceState } from "@/lib/atoms";
import { Command } from "lucide-react";
import { DragEvent } from "react";
import { useRecoilState } from "recoil";

const UploadImage = () => {
  const [image, setImage] = useRecoilState(imageSourceState);
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.files[0] &&
      setImage(URL.createObjectURL(e.dataTransfer.files[0]));
  };
  return (
    <div className="w-full text-muted-foreground flex flex-col gap-8 items-center justify-center">
      <div
        className="border-[3px] border-dashed  rounded-xl p-32 space-y-8"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex gap-4 justify-center">
          <div className="border hover:text-primary-foreground transition-colors rounded-lg w-14 h-14 flex justify-center items-center">
            <Command size={16} />
          </div>
          <div className="border hover:text-primary-foreground transition-colors rounded-lg w-14 h-14 flex justify-center items-center ">
            V
          </div>
        </div>
        <div className=" max-w-[18rem] text-center">
          Paste your screenshot from clipboard or Drag-n-Drop your image here
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
