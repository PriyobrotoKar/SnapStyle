import {
  controlCenterState,
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

const FrameSettings = () => {
  const [frameRadius, setFrameRadius] = useRecoilState(frameRadiusState);
  const [frameDimension, setFrameDimension] =
    useRecoilState(frameDimensionState);
  const [frameFill, setFrameFill] = useRecoilState(frameFillState);
  const controlCenter = useRecoilValue(controlCenterState);

  return (
    <section className="space-y-4">
      <h1 className="text-lg font-medium">Frame Settings</h1>
      <div className="flex gap-6">
        <Control
          label={"W"}
          value={Number(frameDimension.width.toFixed(0))}
          onChange={useCallback(
            (width: number) => setFrameDimension({ ...frameDimension, width }),
            [frameDimension, setFrameDimension]
          )}
        />
        <Control
          label={"H"}
          value={Number(frameDimension.height.toFixed(0))}
          onChange={useCallback(
            (height: number) =>
              setFrameDimension({ ...frameDimension, height }),
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
        defaultFill={controlCenter.frameFill || DEFAULT_FRAME_FILL}
        fill={frameFill}
        onChange={setFrameFill}
        label="Fill"
      />
      <StrokeControl
        strokeType={frameStrokeState}
        defaultFill={
          controlCenter.frameStroke.color || DEFAULT_FRAME_STROKE_FILL
        }
      />
    </section>
  );
};

export default FrameSettings;
