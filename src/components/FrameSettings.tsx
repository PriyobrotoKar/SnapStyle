import {
  controlCenterState,
  enableNoise,
  frameDimensionState,
  frameFillState,
  frameRadiusState,
  frameStrokeState,
} from "@/lib/atoms";
import { DEFAULT_FRAME_FILL, DEFAULT_FRAME_STROKE_FILL } from "@/lib/constants";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";
import StrokeControl from "./StrokeControl";
import { Switch } from "./ui/switch";

const FrameSettings = () => {
  const [frameRadius, setFrameRadius] = useRecoilState(frameRadiusState);
  const [frameDimension, setFrameDimension] =
    useRecoilState(frameDimensionState);
  const [frameFill, setFrameFill] = useRecoilState(frameFillState);
  const [noise, setNoise] = useRecoilState(enableNoise);

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-medium">Frame Settings</h1>
      <div className="flex gap-6">
        <Control
          label={"W"}
          value={Number(frameDimension.width.toFixed(0))}
          onChange={useCallback(
            (width: number) =>
              setFrameDimension({
                ...frameDimension,
                width,
                isCustomDimension: true,
              }),
            [frameDimension, setFrameDimension]
          )}
        />
        <Control
          label={"H"}
          value={Number(frameDimension.height.toFixed(0))}
          onChange={useCallback(
            (height: number) =>
              setFrameDimension({
                ...frameDimension,
                height,
                isCustomDimension: true,
              }),
            [frameDimension, setFrameDimension]
          )}
        />
      </div>
      <Control
        label={useMemo(
          () => (
            <Image src={RadiusIcon} alt="" width={12} height={12} />
          ),
          []
        )}
        value={frameRadius}
        onChange={setFrameRadius}
      />
      <FillControl
        // defaultFill={controlCenter.frameFill || DEFAULT_FRAME_FILL}
        fill={frameFill.color}
        showFill={frameFill.showFill}
        onChange={setFrameFill}
        label="Fill"
      />
      <div className="flex gap-2 items-center">
        <Switch
          id="enableNoise"
          checked={noise}
          onCheckedChange={(checked) => setNoise(checked)}
        />
        <label htmlFor="enableNoise">Noise</label>
      </div>
      <StrokeControl strokeType={frameStrokeState} />
    </section>
  );
};

export default FrameSettings;
