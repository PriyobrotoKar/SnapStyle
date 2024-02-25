"use client";

import { useCanvasImageRendering } from "@/hooks/useCanvasImageRendering";
import { pasteImageFromClipboard } from "@/utils/pasteImage";
import {
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

type CanvasContextProps = {
  preview: string;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  ctx: CanvasRenderingContext2D | null;
  setPreview: Dispatch<SetStateAction<string>>;
  setImageRadius: Dispatch<SetStateAction<number>>;
  setFrameRadius: Dispatch<SetStateAction<number>>;
  setBgFill: Dispatch<SetStateAction<string>>;
  setStrokeWidth: Dispatch<SetStateAction<number>>;
  setStrokeFill: Dispatch<SetStateAction<string>>;
  setImageStrokeWidth: Dispatch<SetStateAction<number>>;
  setImageStrokeFill: Dispatch<SetStateAction<string>>;
  setImageScale: Dispatch<SetStateAction<number>>;
};

const canvasContext = createContext<CanvasContextProps>({
  preview: "",
  canvasRef: { current: null },
  ctx: null,
  setPreview: () => {},
  setImageRadius: () => {},
  setFrameRadius: () => {},
  setBgFill: () => {},
  setStrokeWidth: () => {},
  setStrokeFill: () => {},
  setImageStrokeWidth: () => {},
  setImageStrokeFill: () => {},
  setImageScale: () => {},
});

const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const {
    preview,
    canvasRef,
    ctx,
    setPreview,
    setImageRadius,
    setFrameRadius,
    setBgFill,
    setStrokeWidth,
    setStrokeFill,
    setImageStrokeWidth,
    setImageStrokeFill,
    setImageScale,
  } = useCanvasImageRendering(image);

  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      event.preventDefault();
      try {
        const imageFromClipboard = await pasteImageFromClipboard();
        setImage(await pasteImageFromClipboard());
      } catch (error) {
        toast.error("Please paste an image");
      }
    };
    document.body.addEventListener("paste", handlePaste);
    return () => document.body.removeEventListener("paste", handlePaste);
  }, []);
  return (
    <canvasContext.Provider
      value={{
        preview,
        canvasRef,
        ctx,
        setPreview,
        setImageRadius,
        setFrameRadius,
        setBgFill,
        setStrokeWidth,
        setStrokeFill,
        setImageStrokeWidth,
        setImageStrokeFill,
        setImageScale,
      }}
    >
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
