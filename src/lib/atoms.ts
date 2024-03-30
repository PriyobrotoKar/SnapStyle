import { AtomOptions, RecoilState, atom, selector } from "recoil";
import { DEFAULT_FRAME_FILL, DEFAULT_FRAME_STROKE_FILL } from "./constants";

interface ControlCenterState {
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
