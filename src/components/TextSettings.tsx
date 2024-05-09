import useAutosizeTextArea from "@/hooks/useAutoresizeTextArea";
import { BackdropTextFillState, BackdropTextState } from "@/lib/atoms";
import React, { MouseEvent, useRef } from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";
import Control from "./Control";
import FillControl from "./FillControl";

const PositionGrid = ({
  setTextSettings,
}: {
  setTextSettings: SetterOrUpdater<{
    text: string;
    size: number;
    x: number;
    y: number;
  }>;
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
    <div className="grid grid-cols-3 bg-background gap-2 w-fit p-2 rounded-xl ">
      {/* top-left */}
      {positions.map((position) => {
        return (
          <div
            data-id={position}
            onClick={handleTextPosition}
            className={
              "bg-muted hover:bg-neutral-700 size-4 transition-transform rounded-full hover:cursor-pointer hover:scale-110 " +
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
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Text Settings</h1>
      <div>
        <div className="flex gap-4 h-min items-center bg-background rounded-xl px-3 py-2">
          <div className="text-muted-foreground">T</div>
          <textarea
            ref={textareaRef}
            value={textSettings.text}
            onChange={(e) =>
              setTextSettings({ ...textSettings, text: e.target.value })
            }
            className="bg-transparent outline-none text resize-none w-full h-min"
            placeholder="This is a text"
          />
        </div>
        <Control
          value={textSettings.size}
          onChange={(val: number) =>
            setTextSettings({ ...textSettings, size: val })
          }
        />
        <PositionGrid setTextSettings={setTextSettings} />
        <FillControl
          fill={textColor.color}
          showFill={textColor.showFill}
          onChange={setTextColor}
          label="fill"
        />
      </div>
    </div>
  );
};

export default TextSettings;
