import { Plus } from "lucide-react";
import { Button } from "../../shadcn/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../shadcn/field";
import { Input } from "../../shadcn/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPatientSchema,
  type CreatePatientInput,
} from "@/schemas/patientSchema";
import { useAddPatient } from "@/services/apiPatients";
import { RadioGroup, RadioGroupItem } from "../../shadcn/radio-group";

function AddPatient() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
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
                <div className="grid grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="firstName">firstName</FieldLabel>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      type="text"
                    />
                    {errors.firstName && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.firstName]}
                      />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="middleName">middleName</FieldLabel>
                    <Input
                      id="middleName"
                      {...register("middleName")}
                      type="text"
                    />
                    {errors.middleName && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.middleName]}
                      />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">lastName</FieldLabel>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      type="text"
                    />
                    {errors.lastName && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.lastName]}
                      />
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="dateOfBirth">dateOfBirth</FieldLabel>
                    <Input
                      id="dateOfBirth"
                      {...register("dateOfBirth")}
                      type="date"
                    />
                    {errors.dateOfBirth && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.dateOfBirth]}
                      />
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Phone</FieldLabel>
                    <Input {...register("phone")} type="text" />
                    {errors.phone && (
                      <FieldError className="text-xs" errors={[errors.phone]} />
                    )}
                  </Field>
                </div>
                <div className="grid grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="address">address</FieldLabel>
                    <Input id="address" {...register("address")} type="text" />
                    {errors.address && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.address]}
                      />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="sex">sex</FieldLabel>
                    <Controller
                      name="sex"
                      control={control} // you need to extract `control` from useForm
                      defaultValue="MALE"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="MALE" id="male" />
                            <label htmlFor="male">Male</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="FEMALE" id="female" />
                            <label htmlFor="female">Female</label>
                          </div>
                        </RadioGroup>
                      )}
                    />
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
