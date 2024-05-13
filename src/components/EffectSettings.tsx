import React from "react";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  PatternFillState,
  PatternState,
  ShadowFillState,
  ShadowState,
  activeEffectState,
  noiseState,
} from "@/lib/atoms";
import Control from "./Control";
import FillControl from "./FillControl";
import Label from "./Label";
import { ALargeSmall, Eclipse, Grip, Sun, Tally4, Waves } from "lucide-react";
import { Button } from "./ui/button";
import TextSettings from "./TextSettings";
import { AngleIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export const Grains = () => {
  const [noise, setNoise] = useRecoilState(noiseState);

  return (
    <div className="space-y-2">
      <Label>Grains</Label>
      <div className="flex gap-4">
        <Control
          value={noise.density}
          onChange={(val: number) => setNoise({ ...noise, density: val })}
          label={<Sun size={16} />}
        />
        <Control
          value={noise.opacity}
          onChange={(val: number) => setNoise({ ...noise, opacity: val })}
          label={<Grip size={16} />}
        />
      </div>
    </div>
  );
};

const Shadow = () => {
  const [shadow, setShadow] = useRecoilState(ShadowState);
  const [shadowFill, setShadowFill] = useRecoilState(ShadowFillState);

  return (
    <div className="space-y-2">
      <Label>Shadow</Label>
      <div className="flex gap-4 items-center">
        <Control
          value={shadow.x}
          label="X"
          onChange={(val: number) => setShadow({ ...shadow, x: val })}
        />
        <Control
          value={shadow.y}
          label="Y"
          onChange={(val: number) => setShadow({ ...shadow, y: val })}
        />
        <Control
          value={shadow.blur}
          label={
            <div className="size-3 rounded-full bg-muted-foreground blur-[2px]" />
          }
          onChange={(val: number) => setShadow({ ...shadow, blur: val })}
        />
      </div>
      <FillControl
        fill={shadowFill.color}
        onChange={setShadowFill}
        showFill={shadowFill.showFill}
      />
    </div>
  );
};

const Pattern = () => {
  const [pattern, setPattern] = useRecoilState(PatternState);
  const [patternFill, setPatternFill] = useRecoilState(PatternFillState);

  return (
    <div className="space-y-2">
      <Label>Pattern</Label>
      <div>
        <div className="flex gap-4">
          <Select
            defaultValue={pattern.type}
            onValueChange={(val: "waves" | "zigzag") =>
              setPattern({ ...pattern, type: val })
            }
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waves">Waves</SelectItem>
              <SelectItem value="zigzag">Zigzag</SelectItem>
            </SelectContent>
          </Select>
          <Control
            label={<Tally4 size={16} />}
            value={pattern.intensity}
            onChange={(val: number) =>
              setPattern({ ...pattern, intensity: val })
            }
          />
          <Control
            label={<AngleIcon />}
            value={pattern.rotation}
            onChange={(val: number) =>
              setPattern({ ...pattern, rotation: val })
            }
          />
        </div>
        <FillControl
          fill={patternFill.color}
          showFill={patternFill.showFill}
          onChange={setPatternFill}
        />
      </div>
    </div>
  );
};

const EffectTabs = () => {
  const [active, setActive] = useRecoilState(activeEffectState);

  const tabs = [
    {
      label: <Grip size={16} className="rotate-45" />,
      component: <Grains />,
      name: "noise",
    },
    {
      label: <Eclipse size={16} />,
      component: <Shadow />,
      name: "shadow",
    },
    {
      label: <Waves size={16} />,
      component: <Pattern />,
      name: "pattern",
    },
    {
      label: <ALargeSmall size={16} />,
      component: <TextSettings />,
      name: "text",
    },
  ];

  return (
    <div className="space-x-4">
      {tabs.map((tab, i) => {
        return (
          <Button
            onClick={() => {
              if (!active.find((effect) => effect.name === tab.name))
                setActive([
                  ...active,
                  { name: tab.name, effect: tab.component },
                ]);
              else {
                setActive(
                  active.toSpliced(
                    active.findIndex((effect) => effect.name === tab.name),
                    1
                  )
                );
              }
            }}
            key={i}
            variant={"secondary"}
            size={"icon"}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

const EffectSettings = () => {
  const activeEffects = useRecoilValue(activeEffectState);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-medium">Miscellaneous</h1>

      <EffectTabs />

      <div className="space-y-4">
        {activeEffects.map((tab, i) => {
          return tab.effect;
        })}
      </div>
    </div>
  );
};

export default EffectSettings;
