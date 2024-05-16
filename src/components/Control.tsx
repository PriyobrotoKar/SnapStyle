import { controlCenterState, versionHistoryState } from "@/lib/atoms";
import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  memo,
  useRef,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import DragLabel from "./DragLabel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sendGAEvent } from "@next/third-parties/google";

const Control = ({
  label,
  value,
  onChange,
  tooltip,
}: {
  label?: ReactNode;
  tooltip: string;
  value: number;
  onChange: Dispatch<SetStateAction<number>> | ((val: number) => void);
}) => {
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) {
      return;
    }
    setVersionHistory({
      position: versionHistory.position + 1,
      timeline: [...versionHistory.timeline].toSpliced(
        versionHistory.position + 1,
        versionHistory.timeline.length - (versionHistory.position + 1),
        controlCenter
      ),
    });
    onChange(Number(e.target.value));
    sendGAEvent("event", "tweeked" + tooltip);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => inputRef.current?.select()}
          className="flex ring-1 ring-transparent outline outline-1 outline-transparent hover:outline-border focus-within:outline-0 active:outline-0  active:ring-foreground focus-within:ring-foreground  items-center bg-background w-fit h-min px-4 py-2 rounded-xl"
        >
          <DragLabel label={label} value={value} setValue={onChange} />
          <input
            ref={inputRef}
            className="bg-transparent appearance-none outline-none"
            style={{ width: value.toString().length + "ch" }}
            type="number"
            value={value}
            onChange={handleOnChange}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default memo(Control);
