import { AtomOptions, RecoilState, atom, selector } from "recoil";
import {
  DEFAULT_FRAME_FILL,
  DEFAULT_FRAME_STROKE_FILL,
  DEFAULT_IMAGE_STROKE_FILL,
} from "./constants";

export interface ControlCenterState {
  frameDimension: {
    width: number;
    height: number;
  };
  frameRadius: number;
  frameFill: string;
  frameStroke: {
    color: string;
    width: number;
    position: "inside" | "outside";
  };
  imageStroke: {
    color: string;
    width: number;
    position: "inside" | "outside";
  };
  imageRadius: number;
  imageRotation: number;
  imageScale: number;
}

let atoms: Array<RecoilState<any>> = [];
const createAtom = <T>(options: AtomOptions<T>) => {
  const state = atom(options);
  atoms.push(state);
  return state;
};

export const frameDimensionState = createAtom<
  ControlCenterState["frameDimension"]
>({
  key: "frameDimension",
  default: {
    width: 0,
    height: 0,
  },
});

export const frameRadiusState = createAtom<ControlCenterState["frameRadius"]>({
  key: "frameRadius",
  default: 20,
});

export const frameFillState = createAtom<ControlCenterState["frameFill"]>({
  key: "frameFill",
  default: DEFAULT_FRAME_FILL,
});

export const frameStrokeState = createAtom<ControlCenterState["frameStroke"]>({
  key: "frameStroke",
  default: {
    color: DEFAULT_FRAME_STROKE_FILL,
    width: 5,
    position: "inside",
  },
});

export const imageStrokeState = createAtom<ControlCenterState["imageStroke"]>({
  key: "imageStroke",
  default: {
    color: DEFAULT_IMAGE_STROKE_FILL,
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
});
