import { imageSourceState } from "@/lib/atoms";
import cropImage from "@/lib/cropImage";
import { Crop as CropIcon, Link } from "lucide-react";
import { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PercentCrop,
  convertToPercentCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRecoilState } from "recoil";
import Control from "./Control";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Toggle } from "./ui/toggle";

const CropSettings = () => {
  const [crop, setCrop] = useState<Crop>();
  const [isOpen, setIsOpen] = useState(false);
  const [lockAspect, setLockAspect] = useState(false);
  const [cropAspect, setCropAspect] = useState<string | undefined>();
  // const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [image, setImage] = useRecoilState(imageSourceState);

  if (!image) {
    return null;
  }

  const img = new Image();
  img.src = image;

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const intitalCrop = makeAspectCrop(
      {
        unit: "%",
        width: 100,
        height: 100,
      },
      width / height,
      width,
      height
    );
    setCrop(intitalCrop);
  };

  const handleCropSave = () => {
    if (!crop) {
      return;
    }

    const src = cropImage(img, convertToPixelCrop(crop, img.width, img.height));
    setIsOpen(false);
    src && setImage(src);
  };

  const getCropAspect = () => {
    if (!lockAspect || !crop) {
      return undefined;
    }
    const pCrop = convertToPixelCrop(crop, img.width, img.height);
    return pCrop.width / pCrop.height;
  };

  return (
    <Popover open={isOpen}>
      <PopoverTrigger onClick={() => setIsOpen(!isOpen)}>
        <Button tooltip="Crop" variant={"secondary"} size={"icon"}>
          <CropIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit flex flex-col items-center gap-4"
        align="end"
      >
        <ReactCrop
          className="max-h-[18rem] max-w-[10rem]"
          crop={crop}
          aspect={getCropAspect()}
          onChange={(c, cPer) => setCrop(cPer)}
          // onComplete={(c, cPer) => setCompletedCrop(cPer)}
        >
          <img onLoad={onImageLoad} src={image} alt="crop-preview" />
        </ReactCrop>
        {crop && (
          <div className="flex gap-8">
            <div className="flex gap-4">
              <Control
                tooltip="Width"
                label="W"
                value={Number(
                  convertToPixelCrop(crop, img.width, img.height).width.toFixed(
                    0
                  )
                )}
                onChange={(val: number) =>
                  setCrop(
                    convertToPercentCrop(
                      {
                        ...convertToPixelCrop(crop, img.width, img.height),
                        width: val,
                        ...(getCropAspect() && {
                          height: val / getCropAspect()!,
                        }),
                        unit: "px",
                      },
                      img.width,
                      img.height
                    )
                  )
                }
              />
              <Toggle
                pressed={lockAspect}
                onPressedChange={() => {
                  setCropAspect("auto");
                  setLockAspect(!lockAspect);
                }}
              >
                <Link size={16} />
              </Toggle>
              <Control
                label="H"
                tooltip="height"
                value={Number(
                  convertToPixelCrop(
                    crop,
                    img.width,
                    img.height
                  ).height.toFixed(0)
                )}
                onChange={(val: number) =>
                  setCrop(
                    convertToPercentCrop(
                      {
                        ...convertToPixelCrop(crop, img.width, img.height),
                        height: val,
                        ...(getCropAspect() && {
                          width: val * getCropAspect()!,
                        }),
                        unit: "px",
                      },
                      img.width,
                      img.height
                    )
                  )
                }
              />
            </div>
            <div className="flex gap-4">
              <Select
                defaultValue={"auto"}
                value={cropAspect}
                onValueChange={(val) => {
                  setCropAspect(val);
                  if (val === "auto") {
                    setLockAspect(false);
                    return;
                  }
                  setCrop(
                    makeAspectCrop(
                      { ...crop, unit: "%" },
                      eval(val),
                      img.width,
                      img.height
                    )
                  );
                  setLockAspect(true);
                }}
              >
                <SelectTrigger className="w-[6rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="4/3">4:3</SelectItem>
                </SelectContent>
              </Select>
              <Button tooltip="Save Crop" onClick={handleCropSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CropSettings;
