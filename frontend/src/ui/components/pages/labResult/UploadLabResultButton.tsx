import { useParams } from "react-router";
import { Upload } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { useRef } from "react";
import { useUploadLabResult } from "@/services/apiLabResults";

function UploadLabResultButton() {
  const { patientId } = useParams() as { patientId: string };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: handleUploadLabResult } = useUploadLabResult();

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleUploadLabResult({ patientId, file });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        size="sm"
        className="h-9 shrink-0 gap-1.5 rounded-lg text-xs font-semibold shadow-sm cursor-pointer"
        onClick={handleClick}
      >
        <Upload className="size-3.5" />
        Upload File
      </Button>
    </>
  );
}

export default UploadLabResultButton;
