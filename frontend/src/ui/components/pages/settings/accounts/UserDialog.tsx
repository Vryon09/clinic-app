import { useForm, Controller, useWatch } from "react-hook-form";
import { Button } from "../../../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../shadcn/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../../shadcn/field";
import { Input } from "../../../shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserSchema, type AddUserInput } from "@/schemas/authSchema";
import { cn } from "@/lib/utils";
import { useAddUser, useUpdateUser } from "@/services/apiAuth";
import { toast } from "sonner";
import type { IUser } from "@/types/User";
// import z from "zod";

interface IUserDialog {
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  action: "update" | "create";
  initialValues: IUser;
}

function UserDialog({
  isUserDialogOpen,
  setIsUserDialogOpen,
  action,
  initialValues,
}: IUserDialog) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: initialValues.username,
      role: initialValues.role,
      licenseNum: initialValues.licenseNum,
      firstName: initialValues.firstName,
      middleName: initialValues.middleName,
      lastName: initialValues.lastName,
    },
  });

  const { mutate: handleAddUser } = useAddUser();
  const { mutate: handleUpdateUser } = useUpdateUser();

  const role = useWatch({ control, name: "role" });
  // const licenseNum = useWatch({ control, name: "licenseNum" });

  function onSubmit(data: AddUserInput) {
    // const licenseNumSchema = z.string().regex(/^\d{7}$/, {
    //   message: "Must be exactly 7 digits",
    // });

    // const parsedLicenseNum = licenseNumSchema.safeParse(licenseNum);

    // if (role === "DOCTOR" && !parsedLicenseNum.success) {
    //   toast.error("License Number is required.", {
    //     position: "top-center",
    //   });
    //   return;
    // }

    if (action === "create") {
      handleAddUser(
        {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          username: data.username,
          password: "Password123",
          role: data.role,
          licenseNum: role === "ASSISTANT" ? "" : data.licenseNum,
        },
        {
          onSuccess: () => {
            reset();
            setIsUserDialogOpen(false);
          },
          onError: (err) => {
            toast.error(err.response?.data?.message, {
              position: "top-center",
            });
          },
        },
      );
    }

    if (action === "update") {
      if (
        data.username === initialValues.username &&
        data.role === initialValues.role &&
        data.licenseNum === initialValues.licenseNum
      ) {
        toast.error("No changes", { position: "top-center" });
        setIsUserDialogOpen(false);
        return;
      }

      handleUpdateUser(
        {
          username: data.username,
          role: data.role,
          id: initialValues.id,
          licenseNum: data.licenseNum,
        },
        {
          onSuccess: () => {
            reset();
            setIsUserDialogOpen(false);
          },
          onError: (err) => {
            toast.error(err.response?.data?.message, {
              position: "top-center",
            });
          },
        },
      );
    }
  }

  return (
    <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground">
            {action === "create" ? "Add User Account" : "Update User Account"}
          </DialogTitle>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full space-y-3">
            <FieldGroup className="space-y-3">
              {action === "create" && (
                <div className="grid grid-cols-3 gap-2">
                  <Field className="space-y-1">
                    <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background text-sm"
                      id="firstName"
                      {...register("firstName")}
                      type="text"
                      placeholder="First"
                    />
                    {errors.firstName && (
                      <FieldError
                        className="text-xs text-destructive"
                        errors={[errors.firstName]}
                      />
                    )}
                  </Field>
                  <Field className="space-y-1">
                    <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="middleName">Middle Name</FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background text-sm"
                      id="middleName"
                      {...register("middleName")}
                      type="text"
                      placeholder="Middle"
                    />
                    {errors.middleName && (
                      <FieldError
                        className="text-xs text-destructive"
                        errors={[errors.middleName]}
                      />
                    )}
                  </Field>
                  <Field className="space-y-1">
                    <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background text-sm"
                      id="lastName"
                      {...register("lastName")}
                      type="text"
                      placeholder="Last"
                    />
                    {errors.lastName && (
                      <FieldError
                        className="text-xs text-destructive"
                        errors={[errors.lastName]}
                      />
                    )}
                  </Field>
                </div>
              )}

              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="username">Username</FieldLabel>
                <Input
                  className="h-9 rounded-lg border-border/80 bg-background text-sm"
                  id="username"
                  {...register("username")}
                  type="text"
                  placeholder="Enter username"
                />
                {errors.username && (
                  <FieldError className="text-xs text-destructive" errors={[errors.username]} />
                )}
              </Field>

              {action === "create" && role === "DOCTOR" && (
                <Field className="space-y-1">
                  <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="licenseNum">License Number</FieldLabel>
                  <Input
                    className="h-9 rounded-lg border-border/80 bg-background text-sm"
                    id="licenseNum"
                    {...register("licenseNum")}
                    type="text"
                    placeholder="Enter 7-digit license number"
                  />
                  {errors.licenseNum && (
                    <FieldError
                      className="text-xs text-destructive"
                      errors={[errors.licenseNum]}
                    />
                  )}
                </Field>
              )}

              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-foreground/80">Account Role</FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="grid w-full grid-cols-2 gap-3 pt-1">
                      <div
                        onClick={() => {
                          field.onChange("DOCTOR");
                          setValue("licenseNum", "");
                        }}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 text-center transition-all",
                          field.value === "DOCTOR"
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                            : "border-border/80 hover:bg-muted/40 text-foreground/70"
                        )}
                      >
                        <p className="text-sm font-semibold">Doctor</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Full clinical access</p>
                      </div>

                      <div
                        onClick={() => {
                          field.onChange("ASSISTANT");
                          setValue("licenseNum", "");
                        }}
                        className={cn(
                          "cursor-pointer rounded-xl border p-3 text-center transition-all",
                          field.value === "ASSISTANT"
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                            : "border-border/80 hover:bg-muted/40 text-foreground/70"
                        )}
                      >
                        <p className="text-sm font-semibold">Assistant</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Front desk & intake</p>
                      </div>
                    </div>
                  )}
                />

                {errors.role && (
                  <FieldError className="mt-1 text-xs text-destructive" errors={[errors.role]} />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => setIsUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 rounded-lg font-semibold shadow-xs">
              {action === "create" ? "Create Account" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
