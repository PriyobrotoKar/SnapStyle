import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControlCenterState } from "@/lib/atoms";
import { ListFilter } from "lucide-react";
import { memo } from "react";
import { RecoilState, SetterOrUpdater, useRecoilState } from "recoil";
import Control from "./Control";
import FillControl from "./FillControl";

// interface StrokeControlProps {
//   strokeType: RecoilState<
//     StrokeProperties<ControlCenterState>[keyof StrokeProperties<ControlCenterState>]
//   >;
//   defaultFill: string;
// }

// type EndsWithStroke<T> = T extends `${infer Prefix}Stroke` ? T : never;

// type StrokeProperties<T> = {
//   [K in keyof T as EndsWithStroke<K>]: T[K];
// };

interface StrokeControlProps {
  strokeType: RecoilState<ControlCenterState["frameStroke"]>;
}

const StrokeControl = ({ strokeType }: StrokeControlProps) => {
  const [stroke, setStroke] = useRecoilState(strokeType);
  return (
    <div className="space-y-2">
      <FillControl
        // defaultFill={defaultFill}
        fill={stroke.color}
        showFill={stroke.showFill}
        onChange={
          setStroke as unknown as SetterOrUpdater<
            Pick<ControlCenterState["frameStroke"], "color" | "showFill">
          >
        }
        label="Stroke"
      />
      <div className="flex gap-6">
        <Select
          defaultValue={stroke.position}
          onValueChange={(val: "inside" | "outside") =>
            setStroke({ ...stroke, position: val })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outside">Outside</SelectItem>
            <SelectItem value="inside">Inside</SelectItem>
          </SelectContent>
        </Select>
        <Control
          label={<ListFilter size={16} />}
          tooltip="Width"
          value={stroke.width}
          onChange={(width: number) => setStroke({ ...stroke, width })}
        />
      </div>
    </div>
  );
};

export default memo(StrokeControl);
