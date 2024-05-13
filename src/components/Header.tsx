"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import { Button } from "./ui/button";
import {
  controlCenterState,
  imageSourceState,
  versionHistoryState,
} from "@/lib/atoms";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [image, setImage] = useRecoilState(imageSourceState);
  const [controlCenter, setControlCenter] = useRecoilState(controlCenterState);
  const [versionHistory, setVersionHistory] =
    useRecoilState(versionHistoryState);
  const handleRefreshCanvas = () => {
    location.reload();
  };

  useEffect(() => {
    console.log(versionHistory);
  }, [versionHistory]);

  const handleUndoHistory = () => {
    let newTimeline = [...versionHistory.timeline];
    newTimeline[versionHistory.position] = controlCenter;
    setControlCenter(versionHistory.timeline[versionHistory.position]);
    setVersionHistory({
      position: versionHistory.position - 1,
      timeline: newTimeline,
    });
  };
  const handleRedoHistory = () => {
    let newTimeline = [...versionHistory.timeline];
    newTimeline[versionHistory.position + 1] = controlCenter;
    setControlCenter(versionHistory.timeline[versionHistory.position + 1]);
    setVersionHistory({
      position: versionHistory.position + 1,
      timeline: newTimeline,
    });
  };
  return (
    <div className="bg-card p-4 flex justify-between">
      <div className="text-2xl text-primary font-semibold">BetterSS</div>
      <div className="space-x-4">
        <Button
          tooltip="Undo last change"
          disabled={versionHistory.position === -1}
          variant={"secondary"}
          onClick={handleUndoHistory}
        >
          Undo
        </Button>
        <Button
          tooltip="Redo last change"
          disabled={
            versionHistory.position === versionHistory.timeline.length - 1
          }
          variant={"secondary"}
          onClick={handleRedoHistory}
        >
          Redo
        </Button>
      </div>
      <div className="space-x-4">
        <Button
          tooltip="Reset Canvas"
          variant={"secondary"}
          onClick={handleRefreshCanvas}
        >
          Start Again
        </Button>
        <Button
          tooltip="Coming Soon"
          disabled
          variant={"secondary"}
          onClick={handleRefreshCanvas}
        >
          Save Preset
        </Button>
      </div>
    </div>
  );
};

export default Header;
