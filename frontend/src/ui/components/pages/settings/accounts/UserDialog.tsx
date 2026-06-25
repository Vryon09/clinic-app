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
import { Card } from "../../../shadcn/card";
import { cn } from "@/lib/utils";
import { useAddUser, useUpdateUser } from "@/services/apiAuth";
import { toast } from "sonner";
import type { IUser } from "@/types/User";
import z from "zod";

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
    },
  });

  const { mutate: handleAddUser } = useAddUser();
  const { mutate: handleUpdateUser } = useUpdateUser();

  const role = useWatch({ control, name: "role" });
  const licenseNum = useWatch({ control, name: "licenseNum" });

  function onSubmit(data: AddUserInput) {
    const licenseNumSchema = z.string().regex(/^\d{7}$/, {
      message: "Must be exactly 7 digits",
    });

    const parsedLicenseNum = licenseNumSchema.safeParse(licenseNum);

    if (role === "DOCTOR" && !parsedLicenseNum.success) {
      toast.error("License Number is required.", {
        position: "top-center",
      });
      return;
    }

    if (action === "create") {
      handleAddUser(
        {
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
        data.role === initialValues.role
      ) {
        toast.error("No changes", { position: "top-center" });
        setIsUserDialogOpen(false);
        return;
      }

      handleUpdateUser(
        { username: data.username, role: data.role, id: initialValues.id },
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="username"
                    {...register("username")}
                    type="text"
                  />
                </div>
                {errors.username && (
                  <FieldError className="text-xs" errors={[errors.username]} />
                )}
              </Field>

              {role === "DOCTOR" && (
                <Field>
                  <div className="space-y-1">
                    <FieldLabel htmlFor="licenseNum">Licence Number</FieldLabel>
                    <Input
                      className="border border-neutral-400"
                      id="licenseNum"
                      {...register("licenseNum")}
                      type="text"
                    />
                  </div>
                  {errors.licenseNum && (
                    <FieldError
                      className="text-xs"
                      errors={[errors.licenseNum]}
                    />
                  )}
                </Field>
              )}

              <Field>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="grid w-full grid-cols-2 gap-2">
                      <Card
                        onClick={() => {
                          field.onChange("DOCTOR");
                          setValue("licenseNum", "");
                        }}
                        className={cn(
                          "cursor-pointer px-2 py-3 text-center font-semibold",
                          field.value === "DOCTOR"
                            ? "bg-neutral-950 text-white ring"
                            : "",
                        )}
                      >
                        Doctor
                      </Card>

                      <Card
                        onClick={() => {
                          field.onChange("ASSISTANT");
                          setValue("licenseNum", "");
                        }}
                        className={cn(
                          "cursor-pointer px-2 py-3 text-center font-semibold",
                          field.value === "ASSISTANT"
                            ? "bg-neutral-950 text-white ring"
                            : "",
                        )}
                      >
                        Assistant
                      </Card>
                    </div>
                  )}
                />

                {errors.role && (
                  <FieldError className="mt-2 text-xs" errors={[errors.role]} />
                )}
              </Field>
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

export default UserDialog;
