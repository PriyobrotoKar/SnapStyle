const Preview = ({ preview }: { preview: string }) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      {preview ? (
        <div className="mx-auto border rounded-3xl preview  relative aspect-auto max-w-screen-lg">
          <img
            width={1200}
            height={800}
            className="w-full"
            src={preview}
            alt="Preview Image"
          />
        </div>
      ) : (
        <div className="mx-auto border text-muted-foreground flex justify-center items-center border-dashed rounded-xl preview  relative h-60 w-96">
          Paste your screenshot
        </div>
      )}
    </div>
  );
};

export default Preview;
