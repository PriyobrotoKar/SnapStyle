import { AtomOptions, DefaultValue, RecoilState, atom, selector } from "recoil";
import {
  DEFAULT_FRAME_FILL,
  DEFAULT_FRAME_STROKE_FILL,
  DEFAULT_IMAGE_STROKE_FILL,
} from "./constants";
import { ReactNode } from "react";
import { tabs } from "@/components/EffectSettings";

export interface ControlCenterState {
  frameDimension: {
    isCustomDimension: boolean;
    width: number;
    height: number;
  };
  frameRadius: number;
  frameBgOpacity: number;
  activeFill: "solid" | "gradient" | "image";
  frameFill: {
    color: string;
    showFill: boolean;
  };
  frameGradientRotation: number;
  frameGradientStops: {
    mid: number;
    start: number;
    end: number;
  };
  frameGradientStartFill: {
    color: string;
    showFill: boolean;
  };
  frameGradientEndFill: {
    color: string;
    showFill: boolean;
  };
  frameStroke: {
    color: string;
    showFill: boolean;
    width: number;
    position: "inside" | "outside";
  };
  imagePosition: {
    x: number;
    y: number;
  };
  imagePerspective: {
    x: number;
    y: number;
  };
  imageStroke: {
    color: string;
    showFill: boolean;
    width: number;
    position: "inside" | "outside";
  };
  imageRadius: number;
  imageRotation: number;
  imageScale: number;
  noise: {
    enable: boolean;
    density: number;
    opacity: number;
  };
  fillImage: string;
  fillImageTransform: {
    x: number;
    y: number;
    rotation: number;
    opacity: number;
  };
  fillImageFilter: {
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
  };
  BackdropText: {
    text: string;
    size: number;
    font: string;
    weight: number;
    isBold: boolean;
    isItalics: boolean;
    x: number;
    y: number;
  };
  BackdropTextColor: {
    color: string;
    showFill: boolean;
  };
  shadow: {
    enable: boolean;
    x: number;
    y: number;
    blur: number;
    spread: number;
  };
  shadowFill: {
    color: string;
    showFill: boolean;
  };
  pattern: {
    type: string;
    intensity: number;
    rotation: number;
  };
  patternFill: {
    color: string;
    showFill: boolean;
  };
  activeEffects: {
    name: string;
    effect: JSX.Element;
  }[];
}

interface VersionHistory {
  position: number;
  timeline: ControlCenterState[];
}

let atoms: Array<RecoilState<any>> = [];
const createAtom = <T>(options: AtomOptions<T>) => {
  const state = atom(options);
  atoms.push(state);
  return state;
};

export const imageSourceState = atom<string | null>({
  key: "imageSource",
  default: null,
});

export const PreviewFrameState = atom<HTMLDivElement | null>({
  key: "PreviewFrame",
  default: null,
});
export const versionHistoryState = atom<VersionHistory>({
  key: "VersionHistory",
  default: { position: -1, timeline: [] },
});

export const frameDimensionState = createAtom<
  ControlCenterState["frameDimension"]
>({
  key: "frameDimension",
  default: {
    isCustomDimension: false,
    width: 0,
    height: 0,
  },
});

export const frameRadiusState = createAtom<ControlCenterState["frameRadius"]>({
  key: "frameRadius",
  default: 20,
});
export const frameBgOpacityState = createAtom<
  ControlCenterState["frameBgOpacity"]
>({
  key: "frameBgOpacity",
  default: 1,
});
export const activeFillState = createAtom<ControlCenterState["activeFill"]>({
  key: "activeFill",
  default: "gradient",
});

export const frameFillState = createAtom<ControlCenterState["frameFill"]>({
  key: "frameFill",
  default: {
    color: DEFAULT_FRAME_FILL,
    showFill: true,
  },
});

export const frameGradientRotationState = createAtom<
  ControlCenterState["frameGradientRotation"]
>({
  key: "frameGradientRotation",
  default: 45,
});

export const frameGradientStartFillState = createAtom<
  ControlCenterState["frameGradientStartFill"]
>({
  key: "frameGradientStartFill",
  default: {
    color: "#BE6E81",
    showFill: false,
  },
});
export const frameGradientEndFillState = createAtom<
  ControlCenterState["frameGradientEndFill"]
>({
  key: "frameGradientEndFill",
  default: {
    color: "#DBEEFF",
    showFill: false,
  },
});
export const frameGradientStopState = createAtom<
  ControlCenterState["frameGradientStops"]
>({
  key: "frameGradientStops",
  default: {
    mid: 50,
    start: 0,
    end: 100,
  },
});

export const frameStrokeState = createAtom<ControlCenterState["frameStroke"]>({
  key: "frameStroke",
  default: {
    color: DEFAULT_FRAME_STROKE_FILL,
    showFill: false,
    width: 5,
    position: "inside",
  },
});

export const imagePositionState = createAtom<
  ControlCenterState["imagePosition"]
>({
  key: "imagePosition",
  default: {
    x: 0,
    y: 0,
  },
});
export const imagePerspectiveState = createAtom<
  ControlCenterState["imagePerspective"]
>({
  key: "imagePerspective",
  default: {
    x: 0,
    y: 0,
  },
});

export const imageStrokeState = createAtom<ControlCenterState["imageStroke"]>({
  key: "imageStroke",
  default: {
    color: DEFAULT_IMAGE_STROKE_FILL,
    showFill: false,
    width: 5,
    position: "inside",
  },
});
export const imageRadiusState = createAtom<ControlCenterState["imageRadius"]>({
  key: "imageRadius",
  default: 10,
});
export const imageRotationState = createAtom<
  ControlCenterState["imageRotation"]
>({
  key: "imageRotation",
  default: 0,
});
export const imageScaleState = createAtom<ControlCenterState["imageScale"]>({
  key: "imageScale",
  default: 1,
});
export const noiseState = createAtom<ControlCenterState["noise"]>({
  key: "noise",
  default: {
    enable: true,
    density: 1,
    opacity: 10,
  },
});
export const FillImageState = createAtom<ControlCenterState["fillImage"]>({
  key: "fillImage",
  default: "/imageFallback.svg",
});
export const FillImageFilterState = createAtom<
  ControlCenterState["fillImageFilter"]
>({
  key: "fillImageFilter",
  default: {
    blur: 0,
    contrast: 100,
    brightness: 100,
    saturation: 100,
  },
});
export const FillImageTransformState = createAtom<
  ControlCenterState["fillImageTransform"]
>({
  key: "fillImageTransform",
  default: {
    x: 50,
    y: 50,
    rotation: 0,
    opacity: 1,
  },
});
export const BackdropTextState = createAtom<ControlCenterState["BackdropText"]>(
  {
    key: "BackdropText",
    default: {
      text: "",
      size: 40,
      font: "Nothing You Could Do",
      isBold: true,
      isItalics: false,
      x: 0,
      weight: 200,
      y: 0,
    },
  }
);
export const BackdropTextFillState = createAtom<
  ControlCenterState["BackdropTextColor"]
>({
  key: "BackdropTextColor",
  default: {
    color: "#000000",
    showFill: true,
  },
});
export const ShadowState = createAtom<ControlCenterState["shadow"]>({
  key: "shadow",
  default: {
    enable: true,
    x: 0,
    y: 10,
    blur: 40,
    spread: 0,
  },
});
export const ShadowFillState = createAtom<ControlCenterState["shadowFill"]>({
  key: "shadowFill",
  default: {
    color: "#00000070",
    showFill: true,
  },
});

export const PatternState = createAtom<ControlCenterState["pattern"]>({
  key: "pattern",
  default: {
    type: "waves",
    intensity: 50,
    rotation: 40,
  },
});

export const PatternFillState = createAtom<ControlCenterState["patternFill"]>({
  key: "patternFill",
  default: {
    color: "#00000040",
    showFill: true,
  },
});

export const activeEffectState = createAtom<
  ControlCenterState["activeEffects"]
>({
  key: "activeEffects",
  default: tabs
    .map(({ name, component }) => ({ name, effect: component }))
    .filter((tab) => ["shadow", "noise"].includes(tab.name)),
});

export const controlCenterState = selector<ControlCenterState>({
  key: "controlCenterState",
  get: ({ get }) => {
    const atomsValues = atoms.reduce(
      (acc: Partial<ControlCenterState>, curr) => {
        const value = get(curr);
        acc[curr.key as keyof ControlCenterState] = value;
        return acc;
      },
      {}
    );
    return atomsValues as ControlCenterState;
  },
  set: ({ set }, newValue) => {
    Object.keys(newValue).forEach((key) => {
      set(
        atoms.find((atom) => atom.key === key)!,
        newValue[key as keyof (ControlCenterState | DefaultValue)]
      );
    });
  },
  dangerouslyAllowMutability: true,
});
