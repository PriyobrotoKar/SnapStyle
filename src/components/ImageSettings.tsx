import {
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
import { useRecoilState } from "recoil";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import CropSettings from "./CropSettings";
import StrokeControl from "./StrokeControl";

const ImageSettings = () => {
  const [imageRadius, setImageRadius] = useRecoilState(imageRadiusState);
  const [imageRotation, setImageRotation] = useRecoilState(imageRotationState);
  const [imageScale, setImageScale] = useRecoilState(imageScaleState);
  const [imagePosition, setImagePosition] = useRecoilState(imagePositionState);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Image Settings</h1>
      <div className="flex gap-6 items-center">
        <Control
          label={"X"}
          value={imagePosition.x}
          onChange={(val: number) =>
            setImagePosition({ ...imagePosition, x: val })
          }
        />
        <Control
          label={"Y"}
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
          value={imageRadius}
          onChange={setImageRadius}
        />
        <Control
          label={<AngleIcon />}
          value={imageRotation}
          onChange={setImageRotation}
        />
        <Control
          label={<MoveDiagonal size={16} />}
          value={Number((imageScale * 100).toFixed(0))}
          onChange={(val: number) =>
            setImageScale(Number((val / 100).toFixed(2)))
          }
        />
      </div>

      <StrokeControl
        strokeType={imageStrokeState}
        defaultFill={DEFAULT_IMAGE_STROKE_FILL}
      />
    </div>
  );
};

export default ImageSettings;
