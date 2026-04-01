import { useRef } from "react";
import { Input } from "../../shadcn/input";
import { useParams } from "react-router";
import {
  handeGetLabResults,
  useDeleteLabResult,
  useUploadLabResult,
} from "@/services/apiLabResults";
import { Button } from "../../shadcn/button";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { ILabResult } from "@/types/LabResultType";
import { Upload } from "lucide-react";
// import { shell } from "electron";

function LabResultForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { patientId } = useParams() as { patientId: string };

  const { data: labResults, isPending: isLabResultsPending } = useQuery<
    ILabResult[]
  >({
    queryFn: () => handeGetLabResults({ patientId }),
    queryKey: ["labResults", patientId],
  });

  const { mutate: handleUploadLabResult } = useUploadLabResult();
  const { mutate: handleDeleteLabResult } = useDeleteLabResult();

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleUploadLabResult({ patientId, file });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  console.log(labResults);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div>
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
      </div>

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
              <div
                key={result.id}
                className="grid grid-cols-3 items-center p-2 hover:bg-neutral-200"
              >
                <p className="text-sm">{date}</p>
                <p className="text-center text-sm">{fileName}</p>

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      // shell.openPath(result.filePath);
                      window.open(`http://localhost:3000/${result.filePath}`);
                    }}
                    size="xs"
                    className="w-fit cursor-pointer"
                  >
                    Open
                  </Button>

                  <Button
                    onClick={() => {
                      handleDeleteLabResult(result.id);
                    }}
                    size="xs"
                    className="w-fit cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LabResultForm;
