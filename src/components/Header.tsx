"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { Button } from "./ui/button";
import {
  controlCenterState,
  imageSourceState,
  versionHistoryState,
} from "@/lib/atoms";

const Header = () => {
  const [image, setImage] = useRecoilState(imageSourceState);
  const [controlCenter, setControlCenter] = useRecoilState(controlCenterState);
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const handleRefreshCanvas = () => {
    setImage(null);
    setVersionHistory({ position: -1, timeline: [] });
  };

  const handleUndoHistory = () => {
    setControlCenter(versionHistory.timeline[versionHistory.position]);
    setVersionHistory({
      ...versionHistory,
      position: versionHistory.position - 1,
    });
  };
  return (
    <div className="bg-card p-4 flex justify-between">
      <div className="text-2xl text-primary font-semibold">BetterSS</div>
      <div>
        <Button
          disabled={versionHistory.position === -1}
          variant={"secondary"}
          onClick={handleUndoHistory}
        >
          Undo
        </Button>
      </div>
      <div className="space-x-4">
        <Button variant={"secondary"} onClick={handleRefreshCanvas}>
          Start Again
        </Button>
        <Button disabled variant={"secondary"} onClick={handleRefreshCanvas}>
          Save Preset
        </Button>
      </div>
    </div>
  );
};

export default Header;
