import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <Loader2 className="animate-spin w-4" />
      Loading
    </div>
  );
};

export default Loader;
