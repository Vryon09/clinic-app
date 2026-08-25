import { useAuth } from "@/hooks/useAuth";
import { dataURLToFile } from "@/lib/dataURLtoFIle";
import {
  handleGetSignature,
  useDeleteSignature,
  useUploadSignature,
} from "@/services/apiSignature";
import { Button } from "@/ui/components/shadcn/button";
import { Card } from "@/ui/components/shadcn/card";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignatureSection() {
  const [isAddingSignature, setIsAddingSignature] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const { user, isUserLoading } = useAuth();
  const sigRef = useRef<SignatureCanvas>(null);
  const { data: signatureData } = useQuery({
    queryKey: ["signature", user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error("User ID is required");
      return handleGetSignature(user.id);
    },
    enabled: !!user?.id,
  });

  console.log(signatureData);

  const { mutate: handleUploadSignature } = useUploadSignature();
  const { mutate: handleDeleteSignature, isPending: isDeletingSignature } =
    useDeleteSignature();

  const uploadSignature = () => {
    if (!user) return;
    if (!sigRef.current) return;

    const dataURL = sigRef.current.toDataURL("image/png");

    const file = dataURLToFile(dataURL, `${user.username}-signature.png`);

    handleUploadSignature({ file: file });

    // window.open(url, "_blank");
    // console.log(file);
  };

  return (
    <Card className="mt-4 flex w-full flex-col gap-2 p-4">
      <div>
        <p className="font-semibold">Digital Signature</p>
        <p className="text-xs">Used on prescriptions and lab requests.</p>
      </div>
      {!signatureData && (
        <>
          {!isAddingSignature && (
            <div className="flex h-40 w-full items-center justify-center border-4 border-dashed">
              <p>No signature added.</p>
            </div>
          )}

          {isAddingSignature && (
            <>
              <div className="h-40 bg-neutral-200">
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
                    disabled={isUserLoading}
                    className="bg-blue-600 hover:bg-blue-500 dark:text-white"
                    onClick={uploadSignature}
                  >
                    Upload
                  </Button>
                </div>
              )}
            </>
          )}
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
        </>
      )}

      {signatureData && (
        <>
          <div className="rounded-xl bg-neutral-200">
            <img src={`${`http://localhost:3000/${signatureData.filePath}`}`} />
          </div>

          <Button
            variant="destructive"
            disabled={isDeletingSignature}
            onClick={() => {
              setSignature(null);
              handleDeleteSignature();
              setIsAddingSignature(false);
            }}
          >
            Remove
          </Button>
        </>
      )}
    </Card>
  );
}

export default SignatureSection;
