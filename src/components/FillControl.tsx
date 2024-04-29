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
import {
  Blend,
  Brush,
  Eye,
  EyeOff,
  Image,
  Paintbrush2,
  Pipette,
} from "lucide-react";
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
import { SetterOrUpdater, useRecoilState, useRecoilValue } from "recoil";
import {
  ControlCenterState,
  activeFillState,
  controlCenterState,
  frameGradientEndFillState,
  frameGradientStartFillState,
  versionHistoryState,
} from "@/lib/atoms";
import Label from "./Label";

interface FillControlProps {
  fill: string;
  showFill: boolean;
  enableTabs?: boolean;
  // defaultFill: string;
  onChange: SetterOrUpdater<
    ControlCenterState[
      | "frameFill"
      | "frameStroke"
      | "frameGradientStartFill"
      | "frameGradientEndFill"]
  >;
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
    onChange((prev) => ({ ...prev, color: "#" + fill }));
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
        onChange((prev) => ({
          ...prev,
          color: hsvaToHexa({
            ...hsva,
            a: Number(e.target.value.slice(0, -1)) / 100,
          }),
        }));
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

const SolidFillControl = ({
  showFill,
  onChange,
  hsva,
  setHsva,
}: Omit<FillControlProps, "label" | "fill"> & OpacityInputProps) => {
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);

  const controlCenter = useRecoilValue(controlCenterState);

  return (
    <>
      <div className="flex justify-between">
        <Wheel
          color={hsva}
          onChange={(color) => {
            onChange((prev) => ({
              ...prev,
              color: hsvaToHexa({ ...hsva, ...color.hsva }),
            }));
            setHsva({ ...hsva, ...color.hsva });
            setVersionHistory({
              position: versionHistory.position + 1,
              timeline: [...versionHistory.timeline].toSpliced(
                versionHistory.position + 1,
                versionHistory.timeline.length - (versionHistory.position + 1),
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
            onChange((prev) => ({
              ...prev,
              color: hsvaToHexa({ ...hsva, ...newShade }),
            }));
            setVersionHistory({
              position: versionHistory.position + 1,
              timeline: [...versionHistory.timeline].toSpliced(
                versionHistory.position + 1,
                versionHistory.timeline.length - (versionHistory.position + 1),
                controlCenter
              ),
            });
          }}
        />
      </div>
      <div className="flex gap-2">
        <div
          className="flex bg-yellow-700/10 items-center px-4 py-2 rounded-lg w-fit gap-4"
          style={{
            backgroundColor: hsvaToHex(hsva) + "10",
            opacity: showFill ? 1 : 0.5,
          }}
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
        <Button
          size={"icon"}
          onClick={async () => {
            const color = await getColorFromEyeDropper();
            if (!color) return;
            onChange((prev) => ({ ...prev, color }));
            setHsva(hexToHsva(color));
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
        >
          <Pipette size={14} />
        </Button>
      </div>
    </>
  );
};

const GradientFillControl = ({
  onChange,
}: Pick<FillControlProps, "onChange">) => {
  const [frameGradientStartFill, setFrameGradientStartFill] = useRecoilState(
    frameGradientStartFillState
  );
  const [frameGradientEndFill, setframeGradientEndFill] = useRecoilState(
    frameGradientEndFillState
  );
  const [hsvaStart, setHsvaStart] = useState(
    hexToHsva(frameGradientStartFill.color)
  );
  const [hsvaEnd, setHsvaEnd] = useState(hexToHsva(frameGradientEndFill.color));
  const [activeSelector, setActiveSelector] = useState<"start" | "end">(
    "start"
  );

  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);

  const controlCenter = useRecoilValue(controlCenterState);
  return (
    <div>
      <div className="flex justify-between">
        <Wheel
          color={activeSelector === "start" ? hsvaStart : hsvaEnd}
          onChange={(color) => {
            if (activeSelector === "start") {
              setFrameGradientStartFill((prev) => ({
                ...prev,
                color: hsvaToHexa({ ...hsvaStart, ...color.hsva }),
              }));
              setHsvaStart({ ...hsvaStart, ...color.hsva });
            } else {
              setframeGradientEndFill((prev) => ({
                ...prev,
                color: hsvaToHexa({ ...hsvaEnd, ...color.hsva }),
              }));
              setHsvaEnd({ ...hsvaEnd, ...color.hsva });
            }

            setVersionHistory({
              position: versionHistory.position + 1,
              timeline: [...versionHistory.timeline].toSpliced(
                versionHistory.position + 1,
                versionHistory.timeline.length - (versionHistory.position + 1),
                controlCenter
              ),
            });
          }}
        />
        <ShadeSlider
          hsva={activeSelector === "start" ? hsvaStart : hsvaEnd}
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
            if (activeSelector === "start") {
              setFrameGradientStartFill((prev) => ({
                ...prev,
                color: hsvaToHexa({ ...hsvaStart, ...newShade }),
              }));
              setHsvaStart({ ...hsvaStart, ...newShade });
            } else {
              setframeGradientEndFill((prev) => ({
                ...prev,
                color: hsvaToHexa({ ...hsvaEnd, ...newShade }),
              }));
              setHsvaEnd({ ...hsvaEnd, ...newShade });
            }
            setVersionHistory({
              position: versionHistory.position + 1,
              timeline: [...versionHistory.timeline].toSpliced(
                versionHistory.position + 1,
                versionHistory.timeline.length - (versionHistory.position + 1),
                controlCenter
              ),
            });
          }}
        />
      </div>

      <div>
        <div className="flex gap-2">
          <div
            className="flex bg-yellow-700/10 items-center px-4 py-2 rounded-lg w-fit gap-4"
            style={{
              backgroundColor: hsvaToHex(hsvaStart) + "10",
              border: activeSelector === "start" ? "1px solid white" : "",

              opacity: 1,
            }}
            onClick={() => setActiveSelector("start")}
          >
            <div
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: hsvaToHex(hsvaStart) }}
            ></div>
            <HexFillInput
              hsva={hsvaStart}
              setHsva={setHsvaStart}
              onChange={setFrameGradientStartFill}
            />
            <Separator
              orientation="vertical"
              className="self-stretch h-auto my-1 bg-white"
            />
            <OpacityInput
              onChange={setFrameGradientStartFill}
              hsva={hsvaStart}
              setHsva={setHsvaStart}
            />
          </div>
          <Button
            size={"icon"}
            onClick={async () => {
              const color = await getColorFromEyeDropper();
              if (!color) return;
              setFrameGradientStartFill((prev) => ({ ...prev, color }));
              setHsvaStart(hexToHsva(color));
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
        <div className="flex gap-2">
          <div
            className="flex bg-yellow-700/10 items-center px-4 py-2 rounded-lg w-fit gap-4"
            style={{
              backgroundColor: hsvaToHex(hsvaEnd) + "10",
              border: activeSelector === "end" ? "1px solid white" : "",
              opacity: 1,
            }}
            onClick={() => setActiveSelector("end")}
          >
            <div
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: hsvaToHex(hsvaEnd) }}
            ></div>
            <HexFillInput
              hsva={hsvaEnd}
              setHsva={setHsvaEnd}
              onChange={setframeGradientEndFill}
            />
            <Separator
              orientation="vertical"
              className="self-stretch h-auto my-1 bg-white"
            />
            <OpacityInput
              onChange={setframeGradientEndFill}
              hsva={hsvaEnd}
              setHsva={setHsvaEnd}
            />
          </div>
          <Button
            size={"icon"}
            onClick={async () => {
              const color = await getColorFromEyeDropper();
              if (!color) return;
              setframeGradientEndFill((prev) => ({ ...prev, color }));
              setHsvaEnd(hexToHsva(color));
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
      </div>
    </div>
  );
};

const FillControl = ({
  fill,
  showFill,
  // defaultFill,
  onChange,
  enableTabs = false,
  label,
}: FillControlProps) => {
  const [hsva, setHsva] = useState(hexToHsva(fill));
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);

  const [activeTab, setActiveTab] = useRecoilState(activeFillState);

  const tabs = [
    {
      id: "solid",
      icon: <Paintbrush2 size={14} />,
    },
    {
      id: "gradient",
      icon: <Blend size={14} />,
    },
    {
      id: "image",
      icon: <Image size={14} />,
    },
  ];

  useEffect(() => {
    setHsva(hexToHsva(fill));
  }, [fill]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-4">
        <div
          className="flex items-center px-4 py-2 rounded-xl w-fit gap-4"
          style={{
            backgroundColor: hsvaToHex(hsva) + "10",
            opacity: showFill ? "1" : "0.4",
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
              {activeTab === "solid" ||
                (!enableTabs && (
                  <SolidFillControl
                    showFill={showFill}
                    onChange={onChange}
                    hsva={hsva}
                    enableTabs={enableTabs}
                    setHsva={setHsva}
                  />
                ))}
              {activeTab === "gradient" && enableTabs && (
                <GradientFillControl onChange={onChange} />
              )}

              {enableTabs && (
                <div className="flex gap-2 justify-center items-center">
                  {tabs.map((tab) => {
                    return (
                      <Button
                        onClick={() =>
                          setActiveTab(
                            tab.id as ControlCenterState["activeFill"]
                          )
                        }
                        variant={activeTab === tab.id ? "default" : "secondary"}
                        size={"icon"}
                        key={tab.id}
                      >
                        {tab.icon}
                      </Button>
                    );
                  })}
                </div>
              )}
            </PopoverContent>
          </Popover>
          {activeTab === "solid" || !enableTabs ? (
            <HexFillInput hsva={hsva} setHsva={setHsva} onChange={onChange} />
          ) : activeTab === "gradient" ? (
            <span>Linear</span>
          ) : (
            ""
          )}
          <Separator
            orientation="vertical"
            className="self-stretch h-auto my-1 bg-white"
          />
          <OpacityInput onChange={onChange} hsva={hsva} setHsva={setHsva} />
        </div>
        <Button
          onClick={() => {
            onChange((prev) => ({ ...prev, showFill: !showFill }));
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
          {showFill ? <Eye size={14} /> : <EyeOff size={14} />}
        </Button>
      </div>
    </div>
  );
};

export default memo(FillControl);
