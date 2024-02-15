import { useEffect, useRef, useState } from "react";

export const useCanvasImageRendering = (
  image: HTMLImageElement | undefined
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [preview, setPreview] = useState("");
  const [imageRadius, setImageRadius] = useState(20);
  const [frameRadius, setFrameRadius] = useState(20);
  let context = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
      const ctx = context.current;

      if (ctx && image) {
        console.log(image);
        const x = 70,
          y = 70;
        const width = image.width;
        const height = image.height;
        canvasRef.current.width = width + 150;
        canvasRef.current.height = height + 150;
        // const radius = 20; // Set your desired radius

        // ctx.drawImage(image, x, y);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arcTo(width + 150, 0, width + 150, height + 150, frameRadius);
        ctx.arcTo(width + 150, height + 150, 0, height + 150, frameRadius);
        ctx.arcTo(0, height + 150, 0, 0, frameRadius);
        ctx.arcTo(0, 0, width + 150, 0, frameRadius);
        ctx.closePath();

        ctx.clip();

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + imageRadius, y);
        ctx.arcTo(x + width, y, x + width, y + height, imageRadius);
        ctx.arcTo(x + width, y + height, x, y + height, imageRadius);
        ctx.arcTo(x, y + height, x, y, imageRadius);
        ctx.arcTo(x, y, x + width, y, imageRadius);
        ctx.closePath();

        ctx.filter = "blur(15px)";
        ctx.fillStyle = "#000000A0";
        ctx.fillRect(x, y + 15, width, height + 10);
        // Clip the rounded rectangle
        ctx.clip();

        ctx.filter = "blur(0px)";
        ctx.drawImage(image, x, y);

        setPreview(canvasRef.current.toDataURL("image/png"));
      }
    }
  }, [canvasRef, image, imageRadius, frameRadius]);

  return {
    preview,
    canvasRef,
    ctx: context.current,
    setPreview,
    setImageRadius,
    setFrameRadius,
  };
};
