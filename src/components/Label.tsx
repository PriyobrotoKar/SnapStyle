import React from "react";

const Label = ({ children }: { children: React.ReactNode }) => {
  return <h2 className=" text-primary">{children}</h2>;
};

export default Label;
