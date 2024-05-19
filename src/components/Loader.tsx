import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="absolute md:hidden h-full bottom-0 gap-14 bg-background flex justify-center items-center flex-col">
      <div className="absolute h-full flex justify-center items-center bg-background/50 backdrop-blur-md w-full">
        <Image
          src={"/logo-white.svg"}
          alt="loader"
          width={100}
          height={100}
          className="animate-wiggle"
        />
      </div>
      <div className="text-center space-y-3 pt-20">
        <p className="text-muted-foreground">Introducing</p>
        <h1 className="text-5xl font-semibold ">SnapStyle</h1>
        <p className=" text-muted-foreground text-xl  max-w-[22rem]">
          Your new <span className="italic">favorite</span> screenshot editing
          tool.
        </p>
      </div>
      <div>
        <Image
          className="w-full"
          src={"/mockup.png"}
          alt="mockup"
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default Loader;
