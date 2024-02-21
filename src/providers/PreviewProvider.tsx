"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type PreviewProviderContextProps = {
  fill: string;
  setFill: Dispatch<SetStateAction<string>>;
};

const PreviewProviderContext = createContext<PreviewProviderContextProps>({
  fill: "#ffffff",
  setFill: () => {},
});

const PreviewProvider = ({ children }: { children: ReactNode }) => {
  const [fill, setFill] = useState("");
  return (
    <PreviewProviderContext.Provider value={{ fill, setFill }}>
      {children}
    </PreviewProviderContext.Provider>
  );
};

export default PreviewProvider;

export const usePreviewContext = () => {
  const context = useContext(PreviewProviderContext);
  if (!context) {
    throw new Error(
      "usePreviewContext must be initialized within PreviewProvider"
    );
  }
  return context;
};
