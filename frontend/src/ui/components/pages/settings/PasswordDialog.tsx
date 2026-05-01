import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "../../shadcn/button";
import { useChangePassword } from "@/services/apiAuth";
import { toast } from "sonner";

interface IPasswordDialog {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function PasswordDialog({ open, onOpenChange }: IPasswordDialog) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const { mutate: handleChangePassword } = useChangePassword();

  function onSubmit(data: ChangePasswordInput) {
    handleChangePassword(
      { oldPassword: data.oldPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          reset();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel htmlFor="oldPassword">Old Password</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="oldPassword"
                    {...register("oldPassword")}
                    type="text"
                  />
                </div>
                {errors.oldPassword && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.oldPassword]}
                  />
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="newPassword"
                    {...register("newPassword")}
                    type="text"
                  />
                </div>
                {errors.newPassword && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.newPassword]}
                  />
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

export default PasswordDialog;
