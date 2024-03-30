import { Dispatch, ReactNode, SetStateAction, memo } from "react";

const Control = ({
  label,
  value,
  onChange,
}: {
  label?: ReactNode;
  value: number;
  onChange: Dispatch<SetStateAction<number>> | ((val: number) => void);
}) => {
  return (
    <div className="flex gap-2 items-center bg-background w-fit px-4 py-2 rounded-xl">
      {/* {typeof label !== "object" ? (
        <span className="text-muted-foreground">{label}</span>
      ) : (
        <Image src={label} alt="" width={12} height={12} />
      )} */}
      <span className="text-muted-foreground">{label}</span>
      <input
        className="bg-transparent appearance-none outline-none"
        style={{ width: value.toString().length + "ch" }}
        type="number"
        value={value}
        onChange={(e) =>
          !isNaN(Number(e.target.value)) && onChange(Number(e.target.value))
        }
      />
    </div>
  );
};

export default memo(Control);
