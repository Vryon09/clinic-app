import {
  updateFullNameSchema,
  type UpdateFullNameInput,
} from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "../../../shadcn/button";
import { useUpdateFullName } from "@/services/apiAuth";
import { toast } from "sonner";
import type { IUser } from "@/types/User";

interface IFullNameDialog {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
  isUserLoading: boolean;
}

function FullNameDialog({
  open,
  onOpenChange,
  user,
  isUserLoading,
}: IFullNameDialog) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateFullNameSchema),
    defaultValues: {
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
  });

  const { mutate: handleUpdateFullname } = useUpdateFullName();

  function onSubmit(data: UpdateFullNameInput) {
    handleUpdateFullname(
      {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message, {
            position: "top-center",
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground">Update Full Name</DialogTitle>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full space-y-3">
            <FieldGroup className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <Field className="space-y-1">
                  <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    className="h-10 rounded-lg border-border/80 bg-background text-sm"
                    id="firstName"
                    {...register("firstName")}
                    type="text"
                    placeholder="First name"
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
                    className="h-10 rounded-lg border-border/80 bg-background text-sm"
                    id="middleName"
                    {...register("middleName")}
                    type="text"
                    placeholder="Middle name"
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
                    className="h-10 rounded-lg border-border/80 bg-background text-sm"
                    id="lastName"
                    {...register("lastName")}
                    type="text"
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <FieldError
                      className="text-xs text-destructive"
                      errors={[errors.lastName]}
                    />
                  )}
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isUserLoading}
              type="submit"
              size="sm"
              className="h-9 rounded-lg font-semibold shadow-xs"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FullNameDialog;
