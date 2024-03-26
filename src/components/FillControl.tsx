import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HsvaColor,
  hexToHsva,
  hsvaToHex,
  hsvaToHexa,
} from "@uiw/color-convert";
import Wheel from "@uiw/react-color-wheel";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";
import { Separator } from "./ui/separator";

interface FillControlProps {
  defaultFill: string;
  onChange: Dispatch<SetStateAction<string>>;
  title: string;
}

type OpacityInputProps = Pick<FillControlProps, "onChange"> & {
  hsva: HsvaColor;
  setHsva: Dispatch<SetStateAction<HsvaColor>>;
};

function sanitizeFillColor(fillColor: string, fallbackFIll: string) {
  // Regular expression to match hexadecimal color code
  const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  // Check if the input is a valid hexadecimal color code
  if (hexColorRegex.test(fillColor)) {
    return fillColor.startsWith("#") ? fillColor.slice(1) : fillColor; // Convert to lowercase for consistency
  } else {
    // If the input is not a valid hexadecimal color code, return a default color
    return fallbackFIll.slice(1); // Default to black
  }
}

const HexFillInput = ({ hsva, setHsva, onChange }: OpacityInputProps) => {
  const [fillInput, setFillInput] = useState(hsvaToHex(hsva).slice(1));

  const applyFill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    let fill = sanitizeFillColor(fillInput, hsvaToHex(hsva));
    setFillInput(fill);
    setHsva(hexToHsva("#" + fill));
    onChange("#" + fill);
  };

  const handleHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFillInput(e.target.value);
  };
  return (
    <input
      type="text"
      value={fillInput.toUpperCase()}
      onChange={handleHexInputChange}
      onKeyDown={applyFill}
      className="bg-transparent outline-none text"
      style={{ width: "8ch" }}
    />
  );
};

const OpacityInput = ({ hsva, onChange, setHsva }: OpacityInputProps) => {
  return (
    <input
      type="text"
      value={(hsva.a * 100).toFixed(0) + "%"}
      onChange={(e) => {
        onChange(
          hsvaToHexa({
            ...hsva,
            a: Number(e.target.value.slice(0, -1)) / 100,
          })
        );
        setHsva({
          ...hsva,
          a: Number(e.target.value.slice(0, -1)) / 100,
        });
      }}
      className="bg-transparent outline-none text"
      style={{ width: "4ch" }}
    />
  );
};

const FillControl = ({ defaultFill, onChange, title }: FillControlProps) => {
  const [hsva, setHsva] = useState(hexToHsva(defaultFill));
  console.log(hsvaToHex(hsva));
  return (
    <div>
      <h2 className=" text-primary">{title}</h2>
      <div
        className="flex items-center px-4 py-2 rounded-lg w-fit gap-4"
        style={{ backgroundColor: hsvaToHex(hsva) + "10" }}
      >
        <Popover>
          <PopoverTrigger>
            <div
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: hsvaToHex(hsva) }}
            ></div>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Wheel
              color={hsva}
              onChange={(color) => {
                onChange(hsvaToHexa({ ...hsva, ...color.hsva }));
                setHsva({ ...hsva, ...color.hsva });
              }}
            />

            <div
              className="flex bg-yellow-700/10 items-center px-4 py-2 rounded-lg w-fit gap-4"
              style={{ backgroundColor: hsvaToHex(hsva) + "10" }}
            >
              <div
                className="w-6 h-3 rounded-sm"
                style={{ backgroundColor: hsvaToHex(hsva) }}
              ></div>
              <HexFillInput hsva={hsva} setHsva={setHsva} onChange={onChange} />
              <Separator
                orientation="vertical"
                className="self-stretch h-auto my-1 bg-white"
              />
              <OpacityInput onChange={onChange} hsva={hsva} setHsva={setHsva} />
            </div>
          </PopoverContent>
        </Popover>
        <HexFillInput hsva={hsva} setHsva={setHsva} onChange={onChange} />
        <Separator
          orientation="vertical"
          className="self-stretch h-auto my-1 bg-white"
        />
        <OpacityInput onChange={onChange} hsva={hsva} setHsva={setHsva} />
      </div>
    </div>
  );
};

export default FillControl;
