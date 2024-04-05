import { Button } from "./ui/button";

const Export = () => {
  return (
    <div className="space-x-2 my-6 border rounded-2xl p-2 bg-card  overflow-hidden">
      <Button size={"lg"} variant={"outline"}>
        1x
      </Button>
      <Button size={"lg"} className="w-36" variant={"outline"}>
        Copy
      </Button>
      <Button
        size={"lg"}
        className="w-36 transition-all duration-300 hover:shadow-primary/20 shadow-[0px_0px_16px_5px] shadow-transparent"
      >
        Download
      </Button>
    </div>
  );
};

export default Export;
