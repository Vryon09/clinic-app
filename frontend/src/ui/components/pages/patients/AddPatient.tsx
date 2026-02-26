import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPatientSchema,
  type CreatePatientInput,
} from "@/schemas/patientSchema";
import { useAddPatient } from "@/services/apiPatients";

function AddPatient() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(createPatientSchema),
  });

  const { mutate: handleAddPatient } = useAddPatient();

  function onSubmit(newPatient: CreatePatientInput) {
    handleAddPatient(newPatient);
    reset();
    setIsAdding(false);
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsAdding(true)} className="cursor-pointer">
          <Plus /> <span>Add Patient</span>
        </Button>
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet className="w-full">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" {...register("name")} type="text" />
                </Field>

                <div className="grid grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="age">Age</FieldLabel>
                    <Input id="age" {...register("age")} type="number" />
                  </Field>

                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input {...register("phone")} type="text" />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" className="cursor-pointer">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddPatient;
