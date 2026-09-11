import { Button } from "../../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Popover, PopoverContent, PopoverTrigger } from "../../shadcn/popover";
import { Calendar } from "../../shadcn/calendar";
import dayjs from "dayjs";
import { CalendarIcon, MapPin, Phone, UserPlus, PenBox } from "lucide-react";
import { cn } from "@/lib/utils";

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
  } = useForm<CreatePatientInput>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  function onSubmit(data: CreatePatientInput) {
    handlePatient(data);
    reset();
    setIsOpen();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl border border-border/80 shadow-lg">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-muted/20 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {action === "create" ? (
                <UserPlus className="size-5" />
              ) : (
                <PenBox className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {action === "create" ? "Register New Patient" : "Update Patient Record"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {action === "create"
                  ? "Enter patient demographic and contact details to initialize record."
                  : "Modify demographic and contact information for this patient."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <FieldSet className="w-full space-y-5">
            <FieldGroup className="gap-5">
              {/* Section 1: Patient Names */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Full Legal Name
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel htmlFor="firstName" className="text-xs font-medium text-foreground/90">
                      First Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="firstName"
                      placeholder="First name"
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
                    <FieldLabel htmlFor="middleName" className="text-xs font-medium text-foreground/90">
                      Middle Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="middleName"
                      placeholder="Middle name"
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
                    <FieldLabel htmlFor="lastName" className="text-xs font-medium text-foreground/90">
                      Last Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="lastName"
                      placeholder="Last name"
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
              </div>

              {/* Section 2: Demographics & Contact */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Demographics & Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Field>
                    <FieldLabel htmlFor="dateOfBirth" className="text-xs font-medium text-foreground/90">
                      Date Of Birth <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              type="button"
                              className={cn(
                                "h-9 w-full justify-start rounded-lg border-border/80 bg-background/50 px-3 text-left text-xs font-normal hover:bg-muted/50 cursor-pointer",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 size-3.5 text-muted-foreground" />
                              <span>
                                {field.value
                                  ? dayjs(field.value).format("MMMM DD, YYYY")
                                  : "Select birth date"}
                              </span>
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent side="bottom" align="start" className="w-auto p-0 rounded-xl">
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              onSelect={field.onChange}
                              selected={field.value}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dateOfBirth && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.dateOfBirth]}
                      />
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone" className="text-xs font-medium text-foreground/90">
                      Phone Number <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        className="h-9 rounded-lg border-border/80 bg-background/50 pl-9 text-xs focus-visible:border-primary focus-visible:ring-primary/20"
                        id="phone"
                        placeholder="09123456789"
                        {...register("phone")}
                        type="text"
                      />
                      <Phone className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {errors.phone && (
                      <FieldError className="text-xs" errors={[errors.phone]} />
                    )}
                  </Field>
                </div>
              </div>

              {/* Section 3: Sex & Address */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Sex & Address
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  <Field>
                    <FieldLabel className="text-xs font-medium text-foreground/90">
                      Biological Sex <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      name="sex"
                      control={control}
                      defaultValue="MALE"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-2 mt-0.5"
                        >
                          <label
                            htmlFor="male"
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all",
                              field.value === "MALE"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                            )}
                          >
                            <RadioGroupItem
                              value="MALE"
                              id="male"
                              className="sr-only"
                            />
                            <span>Male</span>
                          </label>

                          <label
                            htmlFor="female"
                            className={cn(
                              "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium cursor-pointer transition-all",
                              field.value === "FEMALE"
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border/80 hover:bg-muted/40 text-muted-foreground"
                            )}
                          >
                            <RadioGroupItem
                              value="FEMALE"
                              id="female"
                              className="sr-only"
                            />
                            <span>Female</span>
                          </label>
                        </RadioGroup>
                      )}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="address" className="text-xs font-medium text-foreground/90">
                      Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        className="h-9 rounded-lg border-border/80 bg-background/50 pl-9 text-xs focus-visible:border-primary focus-visible:ring-primary/20"
                        id="address"
                        placeholder="Street, City, Province"
                        {...register("address")}
                        type="text"
                      />
                      <MapPin className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {errors.address && (
                      <FieldError className="text-xs" errors={[errors.address]} />
                    )}
                  </Field>
                </div>
              </div>
            </FieldGroup>
          </FieldSet>

          {/* Footer */}
          <DialogFooter className="pt-3 border-t border-border/50 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                setIsOpen();
              }}
              className="rounded-lg h-9 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-lg h-9 text-xs font-semibold px-4 cursor-pointer shadow-xs"
            >
              {action === "create" ? "Register Patient" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PatientForm;
