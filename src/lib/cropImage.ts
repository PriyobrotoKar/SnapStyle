import { Crop } from "react-image-crop";

const cropImage = (image: HTMLImageElement, crop: Crop) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }
  const pixelRatio = window.devicePixelRatio;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.translate(-cropX, -cropY);

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  const src = canvas.toDataURL();
  return src;
};

export default cropImage;
