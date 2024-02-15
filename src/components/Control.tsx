import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type ControlProps = {
  property: string | StaticImport;
  value: number;
  onChange: Dispatch<SetStateAction<number>>;
};

const Control = ({ property, value, onChange }: ControlProps) => {
  return (
    <div className="flex gap-4 border border-transparent transition-all hover:border-border focus-within:border-border w-fit py-1 px-2 rounded">
      {typeof property === "string" ? (
        <span>{property}</span>
      ) : (
        <Image src={property} alt="" width={10} height={10} />
      )}
      <input
        className="text-sm bg-transparent border-none outline-none appearance-none w-14"
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};

export default Control;
