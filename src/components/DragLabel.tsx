import React, {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const DragLabel = ({
  allowNegativeValue,
  value,
  setValue,
  label,
}: {
  allowNegativeValue: boolean;
  value: number;
  setValue: Dispatch<SetStateAction<number>> | ((val: number) => void);
  label: ReactNode;
}) => {
  const [snapshot, setSnapshot] = useState(value);

  const [startVal, setStartVal] = useState(0);

  const onStart = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  useEffect(() => {
    const onUpdate = (event: globalThis.MouseEvent) => {
      if (startVal) {
        const value = snapshot + event.clientX - startVal;
        if (allowNegativeValue) {
          setValue(value < 0 ? 0 : value);
        } else {
          setValue(value);
        }
      }
    };

    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, setValue, snapshot, allowNegativeValue]);

  if (!label) {
    return;
  }

  return (
    <span
      onMouseDown={onStart}
      className="text-muted-foreground cursor-ew-resize select-none *:pointer-events-none mr-2"
    >
      {label}
    </span>
  );
};

export default DragLabel;
