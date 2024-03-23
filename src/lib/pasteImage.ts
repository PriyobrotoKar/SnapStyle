export const pasteImageFromClipboard = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .read()
      .then(async (clipboardItems) => {
        const item = await clipboardItems[0].getType("image/png");
        const imgURL = URL.createObjectURL(item);
        console.log(imgURL);
        resolve(imgURL);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
