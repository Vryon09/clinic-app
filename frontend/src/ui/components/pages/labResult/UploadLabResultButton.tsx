import { Upload } from "lucide-react";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { useParams } from "react-router";
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
    <div className="mb-4 flex justify-end">
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <Button onClick={handleClick} className="cursor-pointer rounded-2xl">
        <Upload /> Upload File
      </Button>
    </div>
  );
}

export default UploadLabResultButton;
