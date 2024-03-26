import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useControlContext } from "@/providers/ControlCenterProvider";
import { ListFilter } from "lucide-react";
import Control from "./Control";
import FillControl from "./FillControl";

const StrokeControl = () => {
  const { frameStroke, setFrameStroke } = useControlContext();
  return (
    <div className="space-y-2">
      <FillControl
        defaultFill={frameStroke.color}
        onChange={(color: string) => setFrameStroke({ ...frameStroke, color })}
        label="Stroke"
      />
      <div className="flex gap-6">
        <Select
          defaultValue={frameStroke.position}
          onValueChange={(val: "inside" | "outside") =>
            setFrameStroke({ ...frameStroke, position: val })
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
          value={frameStroke.width}
          onChange={(width: number) =>
            setFrameStroke({ ...frameStroke, width })
          }
        />
      </div>
    </div>
  );
};

export default StrokeControl;
