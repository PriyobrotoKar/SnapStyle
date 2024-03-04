import { useEffect, useRef, useState } from "react";

export const useCanvasImageRendering = (
  image: HTMLImageElement | undefined
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const [imagePosition, setImagePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [preview, setPreview] = useState("");
  const [imageRadius, setImageRadius] = useState(20);
  const [frameRadius, setFrameRadius] = useState(20);
  const [bgFill, setBgFill] = useState("");
  const [strokeFill, setStrokeFill] = useState("");
  const [imageStrokeFill, setImageStrokeFill] = useState("");
  const [strokeWidth, setStrokeWidth] = useState(20);
  const [imageStrokeWidth, setImageStrokeWidth] = useState(10);
  const [imageScale, setImageScale] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);
  const centerX = useRef<number>();
  const centerY = useRef<number>();
  let context = useRef<CanvasRenderingContext2D | null>(null);
  // useEffect(() => {
  //   if (canvasRef && canvasRef.current) {
  //     context.current = canvasRef.current.getContext("2d");
  //     const ctx = context.current;

  //     if (ctx && image) {
  //       console.log(image);
  //       const x = 70,
  //         y = 70;
  //       const width = image.width;
  //       const height = image.height;
  //       canvasRef.current.width = width + 150;
  //       canvasRef.current.height = height + 150;
  //       // const radius = 20; // Set your desired radius

  //       // ctx.drawImage(image, x, y);
  //       ctx.beginPath();
  //       ctx.moveTo(0, 0);
  //       ctx.arcTo(width + 150, 0, width + 150, height + 150, frameRadius);
  //       ctx.arcTo(width + 150, height + 150, 0, height + 150, frameRadius);
  //       ctx.arcTo(0, height + 150, 0, 0, frameRadius);
  //       ctx.arcTo(0, 0, width + 150, 0, frameRadius);
  //       ctx.closePath();

  //       ctx.clip();

  //       // Draw rounded rectangle
  //       ctx.beginPath();
  //       ctx.moveTo(x + imageRadius, y);
  //       ctx.arcTo(x + width, y, x + width, y + height, imageRadius);
  //       ctx.arcTo(x + width, y + height, x, y + height, imageRadius);
  //       ctx.arcTo(x, y + height, x, y, imageRadius);
  //       ctx.arcTo(x, y, x + width, y, imageRadius);
  //       ctx.closePath();

  //       ctx.filter = "blur(15px)";
  //       ctx.fillStyle = "#000000A0";
  //       ctx.fillRect(x, y + 15, width, height + 10);
  //       // Clip the rounded rectangle
  //       ctx.clip();

  //       ctx.filter = "blur(0px)";
  //       ctx.drawImage(image, x, y);

  //       setPreview(canvasRef.current.toDataURL("image/png"));
  //     }
  //   }
  // }, [canvasRef, image, imageRadius, frameRadius, bgFill]);

  useEffect(() => {
    if (!image || !imagePosition || !centerX.current || !centerY.current) {
      return;
    }
    const scaleFactor =
      Math.min(1, 1000 / image.width, 800 / image.height) * (imageScale / 100);
    // const scaleFactor = 1;

    const scaledWidth = image.width * scaleFactor;
    const scaledHeight = image.height * scaleFactor;
    setImagePosition({
      x: imagePosition.x - (scaledWidth - centerX.current) / 2,
      y: imagePosition.y - (scaledHeight - centerY.current) / 2,
    });
    centerX.current = scaledWidth;
    centerY.current = scaledHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageScale]);

  useEffect(() => {
    previewCanvasRef.current = document.createElement("canvas");
    if (previewCanvasRef && previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext("2d");

      if (ctx && image) {
        let width = frameWidth;
        let height = frameHeight;
        console.log(image);
        const scaleFactor =
          Math.min(1, 1000 / image.width, 800 / image.height) *
          (imageScale / 100);
        // const scaleFactor = 1;

        const scaledWidth = image.width * scaleFactor;
        const scaledHeight = image.height * scaleFactor;
        if (!width && !height) {
          width = Math.min(image.width + 150, scaledWidth + 150);
          height = Math.min(image.height + 150, scaledHeight + 150);
          setFrameWidth(width);
          setFrameHeight(height);
        }

        if (!imagePosition) {
          centerX.current = scaledWidth;
          centerY.current = scaledHeight;
          setImagePosition({
            x: (width - scaledWidth) / 2,
            y: (height - scaledHeight) / 2,
          });
          return;
        }

        previewCanvasRef.current.width = width;
        previewCanvasRef.current.height = height;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arcTo(width, 0, width, height, frameRadius);
        ctx.arcTo(width, height, 0, height, frameRadius);
        ctx.arcTo(0, height, 0, 0, frameRadius);
        ctx.arcTo(0, 0, width, 0, frameRadius);
        ctx.closePath();

        ctx.clip();
        ctx.fillStyle = strokeFill;
        ctx.fillRect(0, 0, width, height);

        const w = width - strokeWidth + 2;
        const h = height - strokeWidth + 2;
        const x_ = (width - w) / 2;
        const y_ = (height - h) / 2;
        const r = Math.max(frameRadius - strokeWidth / 2, 0);
        ctx.beginPath();
        ctx.moveTo(x_ + r, y_);
        ctx.arcTo(x_ + w, y_, x_ + w, y_ + h, r);
        ctx.arcTo(x_ + w, y_ + h, x_, y_ + h, r);
        ctx.arcTo(x_, y_ + h, x_, y_, r);
        ctx.arcTo(x_, y_, x_ + w, y_, r);
        ctx.closePath();
        ctx.clip();
        ctx.clearRect(x_, y_, w, h);

        ctx.fillStyle = bgFill;
        ctx.fillRect(x_, y_, w, h);

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.translate(
          imagePosition.x + scaledWidth / 2,
          imagePosition.y + scaledHeight / 2
        );
        ctx.rotate((imageRotation * Math.PI) / 180);
        ctx.filter = "blur(15px)";
        ctx.fillStyle = "#000000A0";
        ctx.roundRect(
          -scaledWidth / 2 - imageStrokeWidth,
          -scaledHeight / 2 - imageStrokeWidth + 15,
          scaledWidth + imageStrokeWidth * 2,
          scaledHeight + imageStrokeWidth * 2 + 10,
          imageRadius
        );
        ctx.fill();
        ctx.filter = "blur(0px)";
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = imageStrokeFill;
        ctx.roundRect(
          -scaledWidth / 2 - imageStrokeWidth,
          -scaledHeight / 2 - imageStrokeWidth,
          scaledWidth + imageStrokeWidth * 2,
          scaledHeight + imageStrokeWidth * 2,
          imageRadius + imageStrokeWidth
        );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(-scaledWidth / 2 + imageRadius, -scaledHeight / 2);
        ctx.arcTo(
          -scaledWidth / 2 + scaledWidth,
          -scaledHeight / 2,
          -scaledWidth / 2 + scaledWidth,
          -scaledHeight / 2 + scaledHeight,
          imageRadius
        );
        ctx.arcTo(
          -scaledWidth / 2 + scaledWidth,
          -scaledHeight / 2 + scaledHeight,
          -scaledWidth / 2,
          -scaledHeight / 2 + scaledHeight,
          imageRadius
        );
        ctx.arcTo(
          -scaledWidth / 2,
          -scaledHeight / 2 + scaledHeight,
          -scaledWidth / 2,
          -scaledHeight / 2,
          imageRadius
        );
        ctx.arcTo(
          -scaledWidth / 2,
          -scaledHeight / 2,
          -scaledWidth / 2 + scaledWidth,
          -scaledHeight / 2,
          imageRadius
        );
        ctx.closePath();

        // Clip the rounded rectangle
        ctx.clip();

        ctx.filter = "blur(0px)";

        ctx.drawImage(
          image,
          -scaledWidth / 2,
          -scaledHeight / 2,
          scaledWidth,
          scaledHeight
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        setPreview(previewCanvasRef.current.toDataURL("image/png"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    previewCanvasRef,
    image,
    imageRadius,
    frameRadius,
    bgFill,
    strokeFill,
    strokeWidth,
    imageStrokeWidth,
    imageStrokeFill,
    imageRotation,
    frameWidth,
    frameHeight,
    imagePosition,
  ]);

  return {
    preview,
    canvasRef,
    ctx: context.current,
    imagePosition,
    imageScale,
    setPreview,
    setImageRadius,
    setFrameRadius,
    setBgFill,
    setStrokeFill,
    setStrokeWidth,
    setImageStrokeWidth,
    setImageStrokeFill,
    setImageScale,
    setImageRotation,
    setImagePosition,
    setFrameHeight,
    setFrameWidth,
  };
};
