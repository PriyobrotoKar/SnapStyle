import { AtomOptions, DefaultValue, RecoilState, atom, selector } from "recoil";
import {
  DEFAULT_FRAME_FILL,
  DEFAULT_FRAME_STROKE_FILL,
  DEFAULT_IMAGE_STROKE_FILL,
} from "./constants";

export interface ControlCenterState {
  frameDimension: {
    isCustomDimension: boolean;
    width: number;
    height: number;
  };
  frameRadius: number;
  activeFill: "solid" | "gradient" | "image";
  frameFill: {
    color: string;
    showFill: boolean;
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
  enableNoise: boolean;
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
export const activeFillState = createAtom<ControlCenterState["activeFill"]>({
  key: "activeFill",
  default: "solid",
});

export const frameFillState = createAtom<ControlCenterState["frameFill"]>({
  key: "frameFill",
  default: {
    color: DEFAULT_FRAME_FILL,
    showFill: true,
  },
});
export const frameGradientStartFillState = createAtom<
  ControlCenterState["frameGradientStartFill"]
>({
  key: "frameGradientStartFill",
  default: {
    color: "#e1e1e1",
    showFill: false,
  },
});
export const frameGradientEndFillState = createAtom<
  ControlCenterState["frameGradientEndFill"]
>({
  key: "frameGradientEndFill",
  default: {
    color: "#aeaeae",
    showFill: false,
  },
});

export const frameStrokeState = createAtom<ControlCenterState["frameStroke"]>({
  key: "frameStroke",
  default: {
    color: DEFAULT_FRAME_STROKE_FILL,
    showFill: true,
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
    showFill: true,
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
export const enableNoise = createAtom<ControlCenterState["enableNoise"]>({
  key: "enableNoise",
  default: true,
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
