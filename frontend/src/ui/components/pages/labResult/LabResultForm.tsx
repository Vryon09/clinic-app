import { useState } from "react";
import { Input } from "../../shadcn/input";
import { useParams } from "react-router";
import { useUploadLabResult } from "@/services/apiLabResults";
import { Button } from "../../shadcn/button";
import { Field, FieldDescription, FieldLabel } from "../../shadcn/field";
import { Card } from "../../shadcn/card";

function LabResultForm() {
  const [file, setFile] = useState<File | null>(null);
  const { patientId } = useParams() as { patientId: string };

  const { mutate: handleUploadLabResult } = useUploadLabResult();

  return (
    <Card className="border border-neutral-300 px-4 py-3">
      <Field>
        <FieldLabel className="text-lg">Upload Lab Result</FieldLabel>
        <Input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0)
              setFile(e.target.files[0]);
          }}
          className="w-fit"
        />
        <FieldDescription>Select Lab Result to upload.</FieldDescription>
        <Button
          onClick={() => {
            if (!file) return;
            handleUploadLabResult({ patientId, file });

            setFile(null);
          }}
          disabled={!file}
          className="mt-4 cursor-pointer"
        >
          {!file ? "Choose File" : "Upload"}
        </Button>
      </Field>
    </Card>
  );
}

export default LabResultForm;
