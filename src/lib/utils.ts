import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
  });
};
