import {
  controlCenterState,
  frameDimensionState,
  imagePerspectiveState,
  imagePositionState,
  imageRadiusState,
  imageRotationState,
  imageScaleState,
  imageStrokeState,
} from "@/lib/atoms";
import { DEFAULT_IMAGE_STROKE_FILL } from "@/lib/constants";
import { AngleIcon } from "@radix-ui/react-icons";
import { MoveDiagonal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import CropSettings from "./CropSettings";
import StrokeControl from "./StrokeControl";
import Label from "./Label";

const ImageSettings = () => {
  const [imageRadius, setImageRadius] = useRecoilState(imageRadiusState);
  const [frameDimension, setFrameDimension] =
    useRecoilState(frameDimensionState);
  const [imageRotation, setImageRotation] = useRecoilState(imageRotationState);
  const [imageScale, setImageScale] = useRecoilState(imageScaleState);
  const [imagePosition, setImagePosition] = useRecoilState(imagePositionState);
  const [imagePerspective, setImagePerspective] = useRecoilState(
    imagePerspectiveState
  );

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Image Settings</h1>
      <div className="flex gap-6 items-center">
        <Control
          label={"X"}
          tooltip="X-Axis"
          value={imagePosition.x}
          onChange={(val: number) =>
            setImagePosition({ ...imagePosition, x: val })
          }
        />
        <Control
          label={"Y"}
          tooltip="Y-Axis"
          value={imagePosition.y}
          onChange={(val: number) =>
            setImagePosition({ ...imagePosition, y: val })
          }
        />
        <CropSettings />
      </div>
      <div className="flex gap-6 items-center">
        <Control
          label={useMemo(
            () => (
              <Image src={RadiusIcon} alt="" width={12} height={12} />
            ),
            []
          )}
          min={0}
          tooltip="Radius"
          value={imageRadius}
          onChange={setImageRadius}
        />
        <Control
          tooltip="Rotate"
          label={<AngleIcon />}
          value={imageRotation}
          onChange={setImageRotation}
        />
        <Control
          min={0}
          tooltip="Scale"
          label={<MoveDiagonal size={16} />}
          value={Number((imageScale * 100).toFixed(0))}
          onChange={(val: number) =>
            setImageScale(Number((val / 100).toFixed(2)))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Perspective</Label>
        <div className="flex gap-6">
          <Control
            label="X"
            tooltip="Tilt-X"
            value={imagePerspective.x}
            onChange={(val: number) =>
              setImagePerspective({ ...imagePerspective, x: val })
            }
          />
          <Control
            label="Y"
            tooltip="Tilt-Y"
            value={imagePerspective.y}
            onChange={(val: number) =>
              setImagePerspective({ ...imagePerspective, y: val })
            }
          />
        </div>
      </div>
      <StrokeControl strokeType={imageStrokeState} />
    </div>
  );
};

export default ImageSettings;
