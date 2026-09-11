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

  const { mutate: handleUploadSignature } = useUploadSignature();
  const { mutate: handleDeleteSignature, isPending: isDeletingSignature } =
    useDeleteSignature();

  const uploadSignature = () => {
    if (!user) return;
    if (!sigRef.current) return;

    const dataURL = sigRef.current.toDataURL("image/png");

    const file = dataURLToFile(dataURL, `${user.username}-signature.png`);

    handleUploadSignature({ file: file });
  };

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Digital Signature</h3>
        <p className="text-xs text-muted-foreground">Used on prescriptions and lab requests</p>
      </div>

      {!signatureData && (
        <>
          {!isAddingSignature && (
            <div className="flex h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">No signature added yet</p>
            </div>
          )}

          {isAddingSignature && (
            <div className="space-y-3">
              <div className="h-36 rounded-xl border border-border bg-muted/10 overflow-hidden">
                <SignatureCanvas
                  ref={sigRef}
                  canvasProps={{ className: "w-full h-full cursor-crosshair" }}
                  onEnd={() => {
                    if (!sigRef.current) return;
                    setSignature(sigRef.current.toDataURL());
                  }}
                />
              </div>

              {!!signature && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-xs"
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
                    size="sm"
                    className="h-8 rounded-lg text-xs font-semibold shadow-xs"
                    onClick={uploadSignature}
                  >
                    Upload Signature
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button
            variant={isAddingSignature ? "outline" : "default"}
            size="sm"
            className="w-full h-9 rounded-lg gap-1.5 text-xs font-semibold"
            onClick={() => setIsAddingSignature((prev) => !prev)}
          >
            {!isAddingSignature ? (
              <>
                <Plus className="size-4" /> Add Signature
              </>
            ) : (
              "Cancel"
            )}
          </Button>
        </>
      )}

      {signatureData && (
        <div className="space-y-3">
          <div className="flex items-center justify-center rounded-xl border border-border/80 bg-muted/20 p-3 h-36">
            <img
              src={`http://localhost:3000/${signatureData.filePath}`}
              alt="Digital Signature"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="w-full h-8 rounded-lg text-xs font-semibold"
            disabled={isDeletingSignature}
            onClick={() => {
              setSignature(null);
              handleDeleteSignature();
              setIsAddingSignature(false);
            }}
          >
            Remove Signature
          </Button>
        </div>
      )}
    </Card>
  );
}

export default SignatureSection;
