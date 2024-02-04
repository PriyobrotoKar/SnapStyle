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
};

const canvasContext = createContext<CanvasContextProps>({
  preview: "",
  canvasRef: { current: null },
  ctx: null,
  setPreview: () => {},
});

const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [image, setImage] = useState<HTMLImageElement>();
  const { preview, canvasRef, ctx, setPreview } =
    useCanvasImageRendering(image);

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
    <canvasContext.Provider value={{ preview, canvasRef, ctx, setPreview }}>
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
