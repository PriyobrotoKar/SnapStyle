import useAutosizeTextArea from "@/hooks/useAutoresizeTextArea";
import {
  BackdropTextFillState,
  BackdropTextState,
  ControlCenterState,
} from "@/lib/atoms";
import { Toggle } from "@/components/ui/toggle";

import React, { MouseEvent, useRef } from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";
import Control from "./Control";
import FillControl from "./FillControl";
import Label from "./Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PositionGrid = ({
  setTextSettings,
}: {
  setTextSettings: SetterOrUpdater<ControlCenterState["BackdropText"]>;
}) => {
  const positions = [
    "top-left",
    "top-center",
    "top-right",
    "center-left",
    "center-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ] as const;
  type Positions = (typeof positions)[number];

  const handleTextPosition = (e: MouseEvent<HTMLDivElement>) => {
    const position: Positions = e.currentTarget.getAttribute(
      "data-id"
    ) as Positions;

    console.log;

    if (!position) {
      return;
    }

    const [verticalAlign, horizontalAlign] = position.split("-");

    console.log(verticalAlign, horizontalAlign);

    switch (horizontalAlign) {
      case "left":
        setTextSettings((prev) => ({ ...prev, x: 0 }));
        break;
      case "center":
        setTextSettings((prev) => ({ ...prev, x: 50 }));
        break;
      case "right":
        setTextSettings((prev) => ({ ...prev, x: 100 }));
        break;
    }
    switch (verticalAlign) {
      case "top":
        setTextSettings((prev) => ({ ...prev, y: 0 }));
        break;
      case "center":
        setTextSettings((prev) => ({ ...prev, y: 50 }));
        break;
      case "bottom":
        setTextSettings((prev) => ({ ...prev, y: 100 }));
        break;
    }
  };
  return (
    <div className="grid grid-cols-3 bg-background hover:scale-100 transition-transform origin-top gap-1 w-fit p-2 rounded-xl ">
      {positions.map((position) => {
        return (
          <div
            data-id={position}
            onClick={handleTextPosition}
            className={
              "bg-muted hover:bg-neutral-700 size-2 transition-transform rounded-full hover:cursor-pointer hover:scale-110 " +
              (position === "center-right" ? "col-start-3" : "")
            }
            key={position}
          ></div>
        );
      })}
    </div>
  );
};

const TextSettings = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textSettings, setTextSettings] = useRecoilState(BackdropTextState);
  const [textColor, setTextColor] = useRecoilState(BackdropTextFillState);
  useAutosizeTextArea(textareaRef.current, textSettings.text);
  return (
    <div className="space-y-2">
      <Label>Typography</Label>
      <div className="space-y-2">
        <div className="flex gap-4 h-min items-center bg-background rounded-xl px-3 py-2">
          <div className="text-muted-foreground">T</div>
          <textarea
            ref={textareaRef}
            value={textSettings.text.replace("<br/>", "\n")}
            rows={1}
            onChange={(e) => {
              console.log(String.raw`${e.target.value}`);
              setTextSettings({
                ...textSettings,
                text: e.target.value.replace("\n", "<br/>"),
              });
            }}
            className="bg-transparent outline-none text resize-none w-full whitespace-pre-wrap"
            placeholder="This is a text"
          />
        </div>
        <FillControl
          fill={textColor.color}
          showFill={textColor.showFill}
          onChange={setTextColor}
        />
        <div className="flex gap-2 items-start">
          <Select
            defaultValue={textSettings.font}
            onValueChange={(val: string) =>
              setTextSettings({ ...textSettings, font: val })
            }
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Default">Normal</SelectItem>
              <SelectItem value="Nothing You Could Do">Scribble</SelectItem>
              <SelectItem value="Playfair Display">Formal</SelectItem>
              <SelectItem value="Zen Dots">Sport</SelectItem>
              <SelectItem value="Sacramento">Cursive</SelectItem>
            </SelectContent>
          </Select>
          <Control
            value={textSettings.size}
            onChange={(val: number) =>
              setTextSettings({ ...textSettings, size: val })
            }
          />
          <Toggle
            pressed={textSettings.isBold}
            onPressedChange={(pressed) =>
              setTextSettings({ ...textSettings, isBold: pressed })
            }
          >
            B
          </Toggle>
          <PositionGrid setTextSettings={setTextSettings} />
        </div>
      </div>
    </div>
  );
};

export default TextSettings;
