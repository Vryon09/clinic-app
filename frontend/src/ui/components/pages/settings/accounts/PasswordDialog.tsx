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
import { useChangePassword } from "@/services/apiAuth";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface IPasswordDialog {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function PasswordDialog({ open, onOpenChange }: IPasswordDialog) {
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

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
      <DialogContent className="sm:max-w-md rounded-2xl border-border/80 p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground">Update Password</DialogTitle>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full space-y-3">
            <FieldGroup className="space-y-3">
              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="oldPassword">Old Password</FieldLabel>
                <div className="relative">
                  <Input
                    className="h-10 rounded-lg border-border/80 bg-background text-sm pr-10"
                    id="oldPassword"
                    {...register("oldPassword")}
                    type={isPasswordShowing ? "text" : "password"}
                    placeholder="Enter current password"
                  />

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordShowing((prev) => !prev);
                    }}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {!isPasswordShowing ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {errors.oldPassword && (
                  <FieldError
                    className="text-xs text-destructive"
                    errors={[errors.oldPassword]}
                  />
                )}
              </Field>

              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="newPassword">New Password</FieldLabel>

                <div className="relative">
                  <Input
                    className="h-10 rounded-lg border-border/80 bg-background text-sm pr-10"
                    id="newPassword"
                    {...register("newPassword")}
                    type={isPasswordShowing ? "text" : "password"}
                    placeholder="Enter new password"
                  />

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordShowing((prev) => !prev);
                    }}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {!isPasswordShowing ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
                {errors.newPassword && (
                  <FieldError
                    className="text-xs text-destructive"
                    errors={[errors.newPassword]}
                  />
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-9 rounded-lg font-semibold shadow-xs">
              Update Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordDialog;
