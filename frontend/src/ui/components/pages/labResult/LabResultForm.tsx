import { useRef, useState } from "react";
import { Input } from "../../shadcn/input";
import { useParams } from "react-router";
import {
  handeGetLabResults,
  useUploadLabResult,
} from "@/services/apiLabResults";
import { Button } from "../../shadcn/button";
import { Field, FieldDescription, FieldLabel } from "../../shadcn/field";
import { Card } from "../../shadcn/card";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { ILabResult } from "@/types/LabResultType";
// import { shell } from "electron";

function LabResultForm() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { patientId } = useParams() as { patientId: string };

  const { data: labResults, isPending: isLabResultsPending } = useQuery<
    ILabResult[]
  >({
    queryFn: () => handeGetLabResults({ patientId }),
    queryKey: ["labResults", patientId],
  });

  const { mutate: handleUploadLabResult } = useUploadLabResult();

  return (
    <Card className="border border-neutral-300 px-4 py-3">
      {!isLabResultsPending && (
        <div>
          {labResults?.map((result) => {
            const pathSplit = result.filePath.split("\\");
            const date = dayjs(
              Number(pathSplit[pathSplit.length - 1].split("-")[0]),
            ).format("MMMM DD, YYYY, hh:mm A");
            const fileName = pathSplit[pathSplit.length - 1]
              .split("-")
              .slice(1)
              .join()
              .split(".")[1]
              .toUpperCase();
            return (
              <div key={result.id} className="flex justify-between">
                <p>{date}</p>
                <p>{fileName}</p>
                <Button
                  onClick={() => {
                    // shell.openPath(result.filePath);
                    window.open(`http://localhost:3000/${result.filePath}`);
                  }}
                >
                  Open File
                </Button>
              </div>
            );
          })}
        </div>
      )}
      <Field>
        <FieldLabel className="text-lg">Upload Lab Result</FieldLabel>
        <Input
          ref={inputRef}
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

            if (inputRef.current) {
              inputRef.current.value = "";
            }
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
