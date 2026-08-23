import { Button } from "@/ui/components/shadcn/button";
import { Card } from "@/ui/components/shadcn/card";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignatureSection() {
  const [isAddingSignature, setIsAddingSignature] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    console.log(signature);
  }, [signature]);

  const downloadSignature = () => {
    if (!sigRef.current) return;

    const dataURL = sigRef.current.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "signature.png";
    link.click();
  };

  return (
    <Card className="mt-4 flex w-full flex-col gap-4 p-4">
      <div className="flex h-50 w-full items-center justify-center border-4 border-dashed">
        <p>No signature added.</p>
      </div>

      <Button
        variant={isAddingSignature ? "destructive" : "default"}
        onClick={() => setIsAddingSignature((prev) => !prev)}
      >
        {!isAddingSignature ? (
          <>
            <Plus /> Add Signature
          </>
        ) : (
          "Cancel"
        )}
      </Button>

      {isAddingSignature && (
        <>
          <div className="bg-white">
            <SignatureCanvas
              ref={sigRef}
              onEnd={() => {
                if (!sigRef.current) return;
                setSignature(sigRef.current.toDataURL());
              }}
            />
          </div>

          {!!signature && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  if (!sigRef.current) return;
                  sigRef.current.clear();
                  setSignature(null);
                }}
              >
                Clear
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-500 dark:text-white"
                onClick={downloadSignature}
              >
                Download
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

export default SignatureSection;
