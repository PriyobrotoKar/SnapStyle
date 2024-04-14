import * as htmlToImage from "html-to-image";

export const exportImage = async (
  elem: HTMLDivElement | null,
  action: "COPY" | "SAVE",
  pixelRatio: 1 | 2 = 1
) => {
  if (!elem) {
    throw new Error("Node cannot be null");
  }
  console.log(pixelRatio);
  const imageUrl = await htmlToImage.toBlob(elem, {
    pixelRatio: pixelRatio * 2,
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
