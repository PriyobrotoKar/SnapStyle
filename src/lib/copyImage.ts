import * as htmlToImage from "html-to-image";

export const exportImage = async (
  elem: HTMLDivElement | null,
  action: "COPY" | "SAVE"
) => {
  if (!elem) {
    throw new Error("Node cannot be null");
  }
  const imageUrl = await htmlToImage.toBlob(elem);
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
    link.download = "my-image-name.jpeg";
    link.href = URL.createObjectURL(imageUrl);
    link.click();
  }
};
