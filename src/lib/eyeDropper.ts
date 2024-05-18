//@ts-nocheck

export const getColorFromEyeDropper = async () => {
  const eyeDropper = new window.EyeDropper();

  try {
    const { sRGBHex } = await eyeDropper.open();

    return sRGBHex;
  } catch (e) {
    return null;
  }
};
