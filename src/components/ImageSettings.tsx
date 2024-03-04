import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCanvasContext } from "@/providers/CanvasProvider";
import cropImage from "@/utils/CropImage";
import { Crop } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactCrop, {
  Crop as CropType,
  PercentCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import RadiusIcon from "../../public/radius.svg";
import Control from "./Control";
import FillControl from "./FillControl";
import WidthControl from "./WidthControl";
import { Button } from "./ui/button";

const ImageSettings = () => {
  const [imgRadius, setImgRadius] = useState(10);
  const [imgScale, setImgScale] = useState(100);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PercentCrop>();
  const [open, setOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const {
    setImageRadius,
    setImageStrokeWidth,
    setImageStrokeFill,
    setImageScale,
    setImagePosition,
    imagePosition,
    image,
    setImage,
    setFrameHeight,
    setFrameWidth,
    imageScale,
  } = useCanvasContext();

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

  useEffect(() => {
    setImageRadius(imgRadius);
  }, [imgRadius, setImageRadius]);
  useEffect(() => {
    setImageScale(imgScale);
  }, [imgScale, setImageScale]);

  return (
    <div>
      <h2 className="text-sm text-muted-foreground">Image</h2>
      <div className="flex gap-6 items-center">
        <Control
          property={"X"}
          value={imagePosition?.x ?? 0}
          onChange={(val: number) =>
            imagePosition && setImagePosition({ x: val, y: imagePosition.y })
          }
        />
        <Control
          property={"Y"}
          value={imagePosition?.y ?? 0}
          onChange={(val: number) =>
            imagePosition && setImagePosition({ x: imagePosition.x, y: val })
          }
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"secondary"} size={"sm"}>
            <Crop size={16} />
          </Button>
        </DialogTrigger>
        {image && (
          <DialogContent className="max-w-fit ">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>

              <ReactCrop
                crop={crop}
                className="max-h-[70vh]"
                onChange={(c, cPer) => setCrop(cPer)}
                onComplete={(c, cPer) => setCompletedCrop(cPer)}
              >
                <Image
                  onLoad={onImageLoad}
                  ref={imgRef}
                  className="w-full"
                  src={image}
                  alt=""
                />
              </ReactCrop>

              <Button
                onClick={() => {
                  completedCrop &&
                    setImage(
                      cropImage(
                        image,
                        convertToPixelCrop(
                          completedCrop,
                          image.width,
                          image.height
                        )
                      )
                    );
                  setFrameWidth(0);
                  setFrameHeight(0);
                  setOpen(false);
                }}
              >
                Crop
              </Button>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
      <Control property={"Scale"} value={imageScale} onChange={setImageScale} />
      <Control
        property={RadiusIcon}
        value={imgRadius}
        onChange={setImgRadius}
      />
      <FillControl
        title="Stroke"
        setFill={setImageStrokeFill}
        defaultFill="#6891af"
      />
      <WidthControl setStroke={setImageStrokeWidth} defaultWidth={5} />
    </div>
  );
};

export default ImageSettings;
