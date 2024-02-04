export const pasteImageFromClipboard = async (): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .read()
      .then(async (clipboardItems) => {
        const item = await clipboardItems[0].getType("image/png");
        const img = new Image();
        img.src = URL.createObjectURL(item);
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (error) => {
          reject(error); // Reject if there's an error loading the image
        };
      })
      .catch((error) => {
        reject(error); // Reject if there's an error reading from the clipboard
      });
  });
};
