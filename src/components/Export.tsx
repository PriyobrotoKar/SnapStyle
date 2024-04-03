import { Button } from "./ui/button";

const Export = () => {
  return (
    <div className="space-x-2 border rounded-2xl p-2 bg-card overflow-hidden">
      <Button size={"lg"} variant={"outline"}>
        1x
      </Button>
      <Button size={"lg"} className="w-36" variant={"outline"}>
        Copy
      </Button>
      <Button size={"lg"} className="w-36 shadow-primary/60 shadow-2xl">
        Download
      </Button>
    </div>
  );
};

export default Export;
