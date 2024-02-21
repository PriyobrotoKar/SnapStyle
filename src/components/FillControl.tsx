import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { HexAlphaColorPicker } from "react-colorful";

const FillControl = ({
  setFill,
  defaultFill,
}: {
  setFill: Dispatch<SetStateAction<string>>;
  defaultFill: string;
}) => {
  const [color, setColor] = useState(defaultFill);
  const [opacity, setOpacity] = useState(defaultFill.substring(7));

  function hexAlphaToPercent(hexAlpha: string) {
    // Remove the '#' symbol if present

    if (!hexAlpha) {
      return 100;
    }

    if (hexAlpha.startsWith("#")) {
      hexAlpha = hexAlpha.slice(1);
    }

    // Parse the hexadecimal alpha code into its corresponding decimal value
    const decimalAlpha = parseInt(hexAlpha, 16);

    // Convert the decimal value to a percentage
    const percentAlpha = (decimalAlpha / 255) * 100;

    return percentAlpha.toFixed(0);
  }

  function percentToHexAlpha(percent: number) {
    // Ensure the input percentage is within the valid range (0 to 100)
    if (percent < 0 || percent > 100) {
      throw new Error("Percentage must be between 0 and 100.");
    }

    // Convert the percentage to a decimal value
    const decimalAlpha = percent / 100;

    // Multiply the decimal value by the maximum value for alpha (255)
    const alphaValue = Math.round(decimalAlpha * 255);

    // Convert the alpha value to its hexadecimal representation
    const hexAlpha = alphaValue.toString(16).toUpperCase();

    // Ensure the hexadecimal representation has two digits
    const hexAlphaCode = hexAlpha.padStart(2, "0");

    return hexAlphaCode;
  }

  const handleOpacity = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value)) || e.target.value.includes("%"))
      setOpacity(e.target.value);
  };

  const validPercent = (value: number | string) => {
    value = Number(value);
    if (value > 100) {
      return 100;
    } else if (value < 0) {
      return 0;
    } else {
      return value;
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (opacity.includes("%")) {
        const newOpacity = opacity.substring(0, opacity.indexOf("%")) + "%";
        console.log(newOpacity.slice(0, -1));
        setOpacity(newOpacity);
        setColor(
          color.substring(0, 7) +
            percentToHexAlpha(Number(newOpacity.slice(0, -1)))
        );
      } else {
        setOpacity(validPercent(opacity) + "%");
        setColor(color.substring(0, 7) + percentToHexAlpha(Number(opacity)));
      }
    }
  };
  useEffect(() => {
    setFill(color);
  }, [color, setFill]);
  useEffect(() => {
    console.log(color.substring(7));
    setOpacity(hexAlphaToPercent(color.substring(7)) + "%");
  }, [color]);

  return (
    <div>
      <h3 className="text-sm text-muted-foreground">Fill</h3>
      <div className="flex gap-3 justify-between items-center">
        <Popover>
          <PopoverTrigger>
            <div className="flex gap-2 items-center border border-transparent transition-all hover:border-border focus-within:border-border w-fit py-1 px-2 rounded">
              <div
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-sm"
              ></div>
              <input
                className="text-sm bg-transparent border-none outline-none appearance-none w-16"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <HexAlphaColorPicker color={color} onChange={setColor} />
            <div className="flex gap-2 items-center border border-transparent transition-all hover:border-border focus-within:border-border w-fit py-1 px-2 rounded">
              <div
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-sm"
              ></div>
              <input
                className="text-sm bg-transparent border-none outline-none appearance-none w-16"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center border border-transparent transition-all hover:border-border focus-within:border-border w-fit py-1 px-2 rounded">
              <input
                className="text-sm bg-transparent border-none outline-none appearance-none w-16"
                type="text"
                value={opacity}
                onChange={handleOpacity}
                onKeyUp={handleKeyUp}
              />
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex gap-2 items-center border border-transparent transition-all hover:border-border focus-within:border-border w-fit py-1 px-2 rounded">
          <span className="text-sm text-muted-foreground">Opacity</span>
          <input
            className="text-sm bg-transparent border-none outline-none appearance-none w-10"
            type="text"
            value={opacity}
            onChange={handleOpacity}
            onKeyUp={handleKeyUp}
          />
        </div>
      </div>
    </div>
  );
};

export default FillControl;
