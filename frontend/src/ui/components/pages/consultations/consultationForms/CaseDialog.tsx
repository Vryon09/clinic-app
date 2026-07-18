import { handleGetDoctors } from "@/services/apiAuth";
import type { IDoctor } from "@/types/User";
import { Button } from "@/ui/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/shadcn/dialog";
import { Field, FieldGroup, FieldLabel } from "@/ui/components/shadcn/field";
import { Input } from "@/ui/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/shadcn/select";
import { useQuery } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import {
  Controller,
  type Control,
  type UseFormHandleSubmit,
  type UseFormRegister,
} from "react-hook-form";

interface ICaseDialog {
  isAddingCase: boolean;
  setIsAddingCase: Dispatch<SetStateAction<boolean>>;
  caseHandleSubmit: UseFormHandleSubmit<
    {
      caseName: string;
      doctorId: string;
    },
    {
      doctorId: string;
      caseName: string;
    }
  >;
  caseOnSubmit: (caseData: { doctorId: string; caseName: string }) => void;
  caseControl: Control<
    {
      caseName: string;
      doctorId: string;
    },
    unknown,
    {
      doctorId: string;
      caseName: string;
    }
  >;
  caseRegister: UseFormRegister<{
    caseName: string;
    doctorId: string;
  }>;
  action: "add" | "update";
}

function CaseDialog({
  isAddingCase,
  setIsAddingCase,
  caseHandleSubmit,
  caseOnSubmit,
  caseControl,
  caseRegister,
  action,
}: ICaseDialog) {
  const { data: doctors, isPending: isDoctorsLoading } = useQuery<IDoctor[]>({
    queryFn: handleGetDoctors,
    queryKey: ["doctors"],
  });

  return (
    <Dialog open={isAddingCase} onOpenChange={setIsAddingCase}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {action === "add" ? "Add New Case" : "Update Case"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={caseHandleSubmit(caseOnSubmit, (errors) =>
            console.log(errors),
          )}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Case Name</FieldLabel>
              <Input type="text" {...caseRegister("caseName")} />
            </Field>

            <Field>
              <FieldLabel>Doctor</FieldLabel>

              <Controller
                name="doctorId"
                control={caseControl}
                render={({ field }) => (
                  <Select
                    disabled={isDoctorsLoading}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {doctors?.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id}
                            className="cursor-pointer"
                          >
                            {doctor.username}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <div className="mt-4 flex justify-end">
              <Button type="submit">
                {action === "add" ? "Add" : "Update"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CaseDialog;
