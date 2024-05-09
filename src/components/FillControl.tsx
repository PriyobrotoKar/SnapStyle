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
  ArrowLeftRight,
  Blend,
  Brush,
  Eye,
  EyeOff,
  Image as ImageIcon,
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
  FillImageFilterState,
  FillImageState,
  FillImageTransformState,
  activeFillState,
  controlCenterState,
  frameGradientEndFillState,
  frameGradientRotationState,
  frameGradientStartFillState,
  frameGradientStopState,
  versionHistoryState,
} from "@/lib/atoms";
import Label from "./Label";
import Control from "./Control";
import { AngleIcon } from "@radix-ui/react-icons";
import ReactSlider from "react-slider";
import Image from "next/image";
import { getBase64 } from "@/lib/utils";

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
  const [frameGradientRotation, setFrameGradientRotation] = useRecoilState(
    frameGradientRotationState
  );
  const [frameGradientEndFill, setframeGradientEndFill] = useRecoilState(
    frameGradientEndFillState
  );
  const [frameGradientStops, setFrameGradientStops] = useRecoilState(
    frameGradientStopState
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

  const handleGradientFlip = () => {
    setFrameGradientStartFill(frameGradientEndFill);
    setframeGradientEndFill(frameGradientStartFill);
    setHsvaStart(hsvaEnd);
    setHsvaEnd(hsvaStart);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between ">
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

      <div className="flex items-center gap-4 justify-center">
        <Control
          label={<AngleIcon />}
          value={frameGradientRotation}
          onChange={setFrameGradientRotation}
        />
        <Button
          onClick={handleGradientFlip}
          size={"icon"}
          variant={"secondary"}
        >
          <ArrowLeftRight size={16} />
        </Button>
      </div>

      <div
        style={{
          background: `linear-gradient(90deg,${frameGradientStartFill.color} ${frameGradientStops.start}%,${frameGradientStops.mid}%,${frameGradientEndFill.color} ${frameGradientStops.end}%)`,
        }}
        className="h-4 relative rounded-full flex  items-center "
      >
        <ReactSlider
          defaultValue={[
            frameGradientStops.start,
            frameGradientStops.mid,
            frameGradientStops.end,
          ]}
          className="w-full h-2"
          onChange={(value) => {
            setFrameGradientStops({
              start: value[0],
              mid: value[1],
              end: value[2],
            });
          }}
          renderTrack={(props) => (
            <span
              {...props}
              className="h-0.5 inline-flex top-1/2 -translate-y-1/2 bg-white"
            ></span>
          )}
          renderThumb={(props, state) => (
            <span
              {...props}
              className="size-2 relative rounded-full bg-white inline-flex z-0 hover:cursor-pointer hover:scale-110 active:cursor-pointer active:scale-110 transition-transform"
            >
              {state.index !== 1 && (
                <>
                  <span
                    className="inline-flex absolute left-1/2 -translate-x-1/2 size-4 border-2 border-white bottom-4 "
                    style={{
                      backgroundColor:
                        state.valueNow <= frameGradientStops.mid &&
                        state.index === 0
                          ? frameGradientStartFill.color
                          : frameGradientEndFill.color,
                    }}
                  ></span>
                  <span className="size-1.5 -z-10 bg-white absolute bottom-3 left-1/2 -translate-x-1/2 rotate-45"></span>
                </>
              )}
            </span>
          )}
        />
      </div>

      <div className="space-y-2">
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

const ImageFillControl = () => {
  const [image, setImage] = useRecoilState(FillImageState);
  const [filters, setFilters] = useRecoilState(FillImageFilterState);
  const [transforms, setTransforms] = useRecoilState(FillImageTransformState);

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }
    const img = e.target.files[0];
    setImage(await getBase64(img));
  };

  const handleFilterSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="relative group rounded-xl overflow-hidden">
        <Image
          src={image}
          alt="imageFallback"
          className="w-72"
          width={500}
          height={300}
        />
        <div className="absolute w-full h-full inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
          <input
            className="hidden"
            type="file"
            name="bgImage"
            id="bgImage"
            onChange={handleChangeImage}
          />
          <Button variant={"secondary"}>
            <label htmlFor="bgImage">Choose Image</label>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 justify-center items-center">
        <Control
          value={transforms.x}
          label="X"
          onChange={(val: number) => setTransforms({ ...transforms, x: val })}
        />
        <Control
          value={transforms.y}
          label="Y"
          onChange={(val: number) => setTransforms({ ...transforms, y: val })}
        />
        <Control
          value={transforms.rotation}
          label={<AngleIcon />}
          onChange={(val: number) =>
            setTransforms({ ...transforms, rotation: val })
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          Blur{" "}
          <input
            type="range"
            name="blur"
            className="slider appearance-none bg-transparent "
            id=""
            value={filters.blur}
            onChange={handleFilterSliderChange}
          />
        </div>
        <div className="flex items-center justify-between">
          Brightness{" "}
          <input
            type="range"
            name="brightness"
            max={200}
            id=""
            className="slider appearance-none bg-transparent "
            value={filters.brightness}
            onChange={handleFilterSliderChange}
          />
        </div>
        <div className="flex items-center justify-between">
          Contrast{" "}
          <input
            type="range"
            name="contrast"
            max={200}
            id=""
            className="slider appearance-none bg-transparent "
            value={filters.contrast}
            onChange={handleFilterSliderChange}
          />
        </div>
        <div className="flex items-center justify-between">
          Saturation{" "}
          <input
            type="range"
            max={200}
            name="saturation"
            id=""
            className="slider appearance-none bg-transparent "
            value={filters.saturation}
            onChange={handleFilterSliderChange}
          />
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
      icon: <ImageIcon size={14} />,
    },
  ];

  const gradient = (opacity: string) => {
    return `linear-gradient(${controlCenter.frameGradientRotation}deg,${
      (controlCenter.frameGradientStartFill.color.length > 7
        ? controlCenter.frameGradientStartFill.color.slice(0, -2)
        : controlCenter.frameGradientStartFill.color) + opacity
    } ${controlCenter.frameGradientStops.start}%,${
      controlCenter.frameGradientStops.mid
    }%,${
      (controlCenter.frameGradientEndFill.color.length > 7
        ? controlCenter.frameGradientEndFill.color.slice(0, -2)
        : controlCenter.frameGradientEndFill.color) + opacity
    } ${controlCenter.frameGradientStops.end}%)`;
  };

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
            background:
              activeTab === "solid" || !enableTabs
                ? hsvaToHex(hsva) + "10"
                : gradient("20"),
            opacity: showFill ? "1" : "0.4",
          }}
        >
          <Popover>
            <PopoverTrigger>
              <div
                className="w-6 h-3 rounded-sm"
                style={{
                  background:
                    activeTab === "solid" || !enableTabs
                      ? hsvaToHex(hsva)
                      : activeTab === "gradient"
                      ? gradient("FF")
                      : `url(${controlCenter.fillImage}) center center / cover`,
                }}
              ></div>
            </PopoverTrigger>
            <PopoverContent className="w-fit space-y-4">
              {(activeTab === "solid" || !enableTabs) && (
                <SolidFillControl
                  showFill={showFill}
                  onChange={onChange}
                  hsva={hsva}
                  enableTabs={enableTabs}
                  setHsva={setHsva}
                />
              )}
              {activeTab === "gradient" && enableTabs && (
                <GradientFillControl onChange={onChange} />
              )}
              {activeTab === "image" && enableTabs && <ImageFillControl />}

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
            <span>Image</span>
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
