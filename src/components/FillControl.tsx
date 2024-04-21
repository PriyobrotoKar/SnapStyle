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
import ShadeSlider from "@uiw/react-color-shade-slider";
import { Eye, EyeOff, Pipette } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { getColorFromEyeDropper } from "@/lib/eyeDropper";
import { useRecoilState, useRecoilValue } from "recoil";
import { controlCenterState, versionHistoryState } from "@/lib/atoms";

interface FillControlProps {
  fill: string;
  defaultFill: string;
  onChange: Dispatch<SetStateAction<string>> | ((val: string) => void);
  label: string;
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
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);

  useEffect(() => {
    setFillInput(hsvaToHex(hsva).slice(1));
  }, [hsva]);

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
    setVersionHistory({
      position: versionHistory.position + 1,
      timeline: [...versionHistory.timeline].toSpliced(
        versionHistory.position + 1,
        versionHistory.timeline.length - (versionHistory.position + 1),
        controlCenter
      ),
    });
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
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);
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
        setVersionHistory({
          position: versionHistory.position + 1,
          timeline: [...versionHistory.timeline, controlCenter],
        });
      }}
      className="bg-transparent outline-none text"
      style={{ width: "4ch" }}
    />
  );
};

const FillControl = ({
  fill,
  defaultFill,
  onChange,
  label,
}: FillControlProps) => {
  const [hsva, setHsva] = useState(hexToHsva(defaultFill));
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);

  useEffect(() => {
    setHsva(hexToHsva(defaultFill));
  }, [defaultFill]);

  return (
    <div className="space-y-2">
      <h2 className=" text-primary">{label}</h2>
      <div className="flex gap-4">
        <div
          className="flex items-center px-4 py-2 rounded-xl w-fit gap-4"
          style={{
            backgroundColor: hsvaToHex(hsva) + "10",
            opacity: fill ? "1" : "0.4",
          }}
        >
          <Popover>
            <PopoverTrigger>
              <div
                className="w-6 h-3 rounded-sm"
                style={{ backgroundColor: hsvaToHex(hsva) }}
              ></div>
            </PopoverTrigger>
            <PopoverContent className="w-fit space-y-4">
              <div className="flex justify-between">
                <Wheel
                  color={hsva}
                  onChange={(color) => {
                    onChange(hsvaToHexa({ ...hsva, ...color.hsva }));
                    setHsva({ ...hsva, ...color.hsva });
                    setVersionHistory({
                      position: versionHistory.position + 1,
                      timeline: [...versionHistory.timeline].toSpliced(
                        versionHistory.position + 1,
                        versionHistory.timeline.length -
                          (versionHistory.position + 1),
                        controlCenter
                      ),
                    });
                  }}
                />
                <ShadeSlider
                  hsva={hsva}
                  direction="vertical"
                  className="w-8 self-stretch "
                  // radius={8}
                  // bgProps={{ style: { borderWidth: 2 } }}
                  style={{ height: "auto" }}
                  pointerProps={{
                    className: "w-full",
                    fillProps: {
                      style: {
                        width: "100%",
                        borderRadius: 0,
                        position: "relative",
                        left: "1px",
                        top: "9px",
                        height: 2,
                      },
                    },
                  }}
                  onChange={(newShade) => {
                    setHsva({ ...hsva, ...newShade });
                    onChange(hsvaToHexa({ ...hsva, ...newShade }));
                    setVersionHistory({
                      position: versionHistory.position + 1,
                      timeline: [...versionHistory.timeline].toSpliced(
                        versionHistory.position + 1,
                        versionHistory.timeline.length -
                          (versionHistory.position + 1),
                        controlCenter
                      ),
                    });
                  }}
                />
              </div>

              <div className="flex gap-2">
                <div
                  className="flex bg-yellow-700/10 items-center px-4 py-2 rounded-lg w-fit gap-4"
                  style={{ backgroundColor: hsvaToHex(hsva) + "10" }}
                >
                  <div
                    className="w-6 h-3 rounded-sm"
                    style={{ backgroundColor: hsvaToHex(hsva) }}
                  ></div>
                  <HexFillInput
                    hsva={hsva}
                    setHsva={setHsva}
                    onChange={onChange}
                  />
                  <Separator
                    orientation="vertical"
                    className="self-stretch h-auto my-1 bg-white"
                  />
                  <OpacityInput
                    onChange={onChange}
                    hsva={hsva}
                    setHsva={setHsva}
                  />
                </div>
                <Button
                  size={"icon"}
                  onClick={async () => {
                    const color = await getColorFromEyeDropper();
                    if (!color) return;
                    onChange(color);
                    setHsva(hexToHsva(color));
                    setVersionHistory({
                      position: versionHistory.position + 1,
                      timeline: [...versionHistory.timeline].toSpliced(
                        versionHistory.position + 1,
                        versionHistory.timeline.length -
                          (versionHistory.position + 1),
                        controlCenter
                      ),
                    });
                  }}
                  variant={"secondary"}
                >
                  <Pipette size={14} />
                </Button>
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
        <Button
          onClick={() => {
            onChange(fill ? "" : hsvaToHexa(hsva));
            setVersionHistory({
              position: versionHistory.position + 1,
              timeline: [...versionHistory.timeline].toSpliced(
                versionHistory.position + 1,
                versionHistory.timeline.length - (versionHistory.position + 1),
                controlCenter
              ),
            });
          }}
          variant={"secondary"}
          size={"icon"}
        >
          {fill ? <Eye size={14} /> : <EyeOff size={14} />}
        </Button>
      </div>
    </div>
  );
};

export default memo(FillControl);
