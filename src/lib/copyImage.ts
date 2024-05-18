import * as htmlToImage from "html-to-image";
import { Options } from "html-to-image/lib/types";

export const exportImage = async (
  elem: HTMLDivElement | null,
  action: "COPY" | "SAVE",
  pixelRatio: 1 | 2 = 1,
  options: Options
) => {
  if (!elem) {
    throw new Error("Node cannot be null");
  }
  console.log(pixelRatio);
  const imageUrl = await htmlToImage.toBlob(elem, {
    ...options,
    pixelRatio,
  });
  if (!imageUrl) {
    throw new Error("Error in copying image");
  }
  if (action === "COPY") {
    await navigator.clipboard.write([
      new ClipboardItem({
        [imageUrl.type]: imageUrl,
      }),
    ]);
  } else {
    let link = document.createElement("a");
    link.download = "my-image-name.png";
    link.href = URL.createObjectURL(imageUrl);
    link.click();
  }
};
