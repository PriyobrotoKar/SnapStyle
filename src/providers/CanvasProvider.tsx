"use client";

import { useCanvasImageRendering } from "@/hooks/useCanvasImageRendering";
import { pasteImageFromClipboard } from "@/utils/pasteImage";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

type CanvasContextProps = ReturnType<typeof useCanvasImageRendering> & {
  image: HTMLImageElement | undefined;
  setImage: Dispatch<SetStateAction<HTMLImageElement | undefined>>;
};

const canvasContext = createContext<CanvasContextProps | null>(null);

const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const options = useCanvasImageRendering(image);

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      event.preventDefault();
      try {
        const imageFromClipboard = await pasteImageFromClipboard();
        options.setFrameHeight(0);
        options.setFrameWidth(0);
        options.setImagePosition(null);
        options.setImageScale(100);
        setImage(imageFromClipboard);
      } catch (error) {
        toast.error("Please paste an image");
      }
    };
    document.body.addEventListener("paste", handlePaste);
    return () => document.body.removeEventListener("paste", handlePaste);
  }, [options]);
  return (
    <canvasContext.Provider value={{ ...options, image, setImage }}>
      {children}
    </canvasContext.Provider>
  );
};

export default CanvasProvider;

export const useCanvasContext = () => {
  const context = useContext(canvasContext);
  if (!context) {
    throw new Error(
      "useCanvasContext must be initialized within CanvasProvider"
    );
  }
  return context;
};
