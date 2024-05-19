import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-10 flex-1 justify-center">
      <div className="text-center space-y-3 pt-20">
        <p className=" text-muted-foreground">Oops!</p>
        <h1 className="text-5xl font-semibold ">Try on PC</h1>
        <p className=" text-muted-foreground text-xl  max-w-[22rem]">
          We are not on phones yet :&#40;
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

export default page;
