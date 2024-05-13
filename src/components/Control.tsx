import { controlCenterState, versionHistoryState } from "@/lib/atoms";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, memo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import DragLabel from "./DragLabel";

const Control = ({
  label,
  value,
  onChange,
}: {
  label?: ReactNode;
  value: number;
  onChange: Dispatch<SetStateAction<number>> | ((val: number) => void);
}) => {
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const controlCenter = useRecoilValue(controlCenterState);

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
  };

  return (
    <div className="flex  items-center bg-background w-fit h-min px-4 py-2 rounded-xl">
      <DragLabel label={label} value={value} setValue={onChange} />
      <input
        className="bg-transparent appearance-none outline-none"
        style={{ width: value.toString().length + "ch" }}
        type="number"
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default memo(Control);
