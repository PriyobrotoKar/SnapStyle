import { imageSourceState } from "@/lib/atoms";
import { pasteImageFromClipboard } from "@/lib/pasteImage";
import { Command, Plus } from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { getBase64 } from "@/lib/utils";

const UploadImage = () => {
  const [image, setImage] = useRecoilState(imageSourceState);

  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.files[0] &&
      setImage(URL.createObjectURL(e.dataTransfer.files[0]));
  };

  const handleUploadFromDevice = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setImage(await getBase64(e.target.files[0]));
    }
  };

  const handlePaste = useCallback(
    async (event: ClipboardEvent) => {
      event.preventDefault();
      try {
        const imageFromClipboard = await pasteImageFromClipboard();
        setImage(imageFromClipboard);
      } catch (error) {
        toast.error("Please paste an image");
      }
    },
    [setImage]
  );

  const handleSetKeysPressed = useCallback(
    (event: KeyboardEvent) => {
      setKeysPressed((prev) => [...prev, event.key]);
    },
    [setKeysPressed]
  );
  const handleUnsetKeysPressed = useCallback(
    (event: KeyboardEvent) => {
      if (keysPressed.length >= 2) {
        setKeysPressed([]);
        return;
      }
      setKeysPressed((prev) => prev.toSpliced(prev.indexOf(event.key), 1));
    },
    [setKeysPressed, keysPressed]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", handleSetKeysPressed);
    document.body.addEventListener("keyup", handleUnsetKeysPressed);
    document.body.addEventListener("paste", handlePaste);
    return () => {
      document.body.removeEventListener("paste", handlePaste);
      document.body.removeEventListener("keydown", handleSetKeysPressed);
      document.body.removeEventListener("keyup", handleUnsetKeysPressed);
    };
  }, [handlePaste, handleSetKeysPressed, handleUnsetKeysPressed]);
  return (
    <div className="w-full text-muted-foreground flex flex-col gap-8 items-center justify-center">
      <div
        className="border-[3px] border-dashed  rounded-xl py-20 px-32 gap-8 flex flex-col justify-center items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex gap-4 justify-center">
          <div
            className={
              "border hover:text-primary-foreground transition-colors rounded-lg w-14 h-14 flex justify-center items-center " +
              (keysPressed.includes("Meta") || keysPressed.includes("Control")
                ? "text-primary-foreground border-primary-foreground"
                : "")
            }
          >
            <Command size={16} />
          </div>
          <div
            className={
              "border hover:text-primary-foreground transition-colors rounded-lg w-14 h-14 flex justify-center items-center " +
              (keysPressed.includes("v")
                ? "text-primary-foreground border-primary-foreground"
                : "")
            }
          >
            V
          </div>
        </div>
        <div className=" max-w-[18rem] text-center">
          Paste your screenshot from clipboard or Drag-n-Drop your image here
        </div>
        <label htmlFor="upload" className="hover:cursor-pointer">
          <Button
            variant={"secondary"}
            className="gap-2 pointer-events-none"
            size={"lg"}
          >
            <Plus size={18} />
            Add from device
          </Button>
        </label>
        <input
          type="file"
          name="upload"
          id="upload"
          className="hidden"
          onChange={handleUploadFromDevice}
        />
      </div>
    </div>
  );
};

export default UploadImage;
