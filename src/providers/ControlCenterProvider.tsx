"use client";

import useControlCenter from "@/hooks/useControlCenter";
import { ReactNode, createContext, useContext } from "react";

type ControlCenterContextProps = ReturnType<typeof useControlCenter>;

const ControlCenterContext = createContext<ControlCenterContextProps | null>(
  null
);

const ControlCenterProvider = ({ children }: { children: ReactNode }) => {
  const controlOptions = useControlCenter();
  return (
    <ControlCenterContext.Provider value={controlOptions}>
      {children}
    </ControlCenterContext.Provider>
  );
};

export default ControlCenterProvider;

export const useControlContext = () => {
  const context = useContext(ControlCenterContext);
  if (!context) {
    throw new Error(
      "useControlContext must be initialized within ControlCenterProvider"
    );
  }
  return context;
};
