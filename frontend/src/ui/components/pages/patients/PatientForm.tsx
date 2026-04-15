import { Button } from "../../shadcn/button";
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
import { RadioGroup, RadioGroupItem } from "../../shadcn/radio-group";

interface PatientFormProps {
  isOpen: boolean;
  setIsOpen: () => void;
  action: "create" | "update";
  initialValues: CreatePatientInput;
  handlePatient: (data: CreatePatientInput) => void;
}

function PatientForm({
  isOpen,
  setIsOpen,
  action,
  initialValues,
  handlePatient,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      ...initialValues,
      dateOfBirth: initialValues.dateOfBirth
        ? initialValues.dateOfBirth.toISOString().split("T")[0]
        : "",
    },
  });

  function onSubmit(data: CreatePatientInput) {
    handlePatient(data);
    reset();
    setIsOpen();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "create" ? "Add" : "Update"} Patient
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <div className="grid grid-cols-3 gap-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
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
                  <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
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
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
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

              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="dateOfBirth">Date Of Birth</FieldLabel>
                  <Input
                    className="border border-neutral-400"
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
                  <Input
                    className="border border-neutral-400"
                    {...register("phone")}
                    type="text"
                  />
                  {errors.phone && (
                    <FieldError className="text-xs" errors={[errors.phone]} />
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="address"
                    {...register("address")}
                    type="text"
                  />
                  {errors.address && (
                    <FieldError className="text-xs" errors={[errors.address]} />
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="sex">Sex</FieldLabel>
                  <Controller
                    name="sex"
                    control={control} // you need to extract `control` from useForm
                    defaultValue="MALE"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex justify-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="MALE"
                            id="male"
                            className="cursor-pointer border border-neutral-400"
                          />
                          <label htmlFor="male">Male</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="FEMALE"
                            id="female"
                            className="cursor-pointer border border-neutral-400"
                          />
                          <label htmlFor="female">Female</label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end">
            <Button type="submit" className="mt-4 cursor-pointer">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PatientForm;
