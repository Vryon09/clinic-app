import {
  updateUsernameSchema,
  type UpdateUsernameInput,
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
import { toast } from "sonner";
import type { IUser } from "@/types/User";
import { useUpdateUsername } from "@/services/apiAuth";

interface IUsernameDialog {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
  isUserLoading: boolean;
}

function UsernameDialog({
  open,
  onOpenChange,
  user,
  isUserLoading,
}: IUsernameDialog) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: user.username,
    },
  });

  const { mutate: handleUpdateUsername } = useUpdateUsername();

  function onSubmit(data: UpdateUsernameInput) {
    handleUpdateUsername(
      {
        username: data.username,
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
          <DialogTitle className="text-lg font-bold text-foreground">Update Username</DialogTitle>
        </DialogHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full space-y-3">
            <FieldGroup className="space-y-3">
              <Field className="space-y-1">
                <FieldLabel className="text-xs font-semibold text-foreground/80" htmlFor="username">Username</FieldLabel>
                <Input
                  className="h-10 rounded-lg border-border/80 bg-background text-sm"
                  id="username"
                  {...register("username")}
                  type="text"
                  placeholder="Enter new username"
                />
                {errors.username && (
                  <FieldError className="text-xs text-destructive" errors={[errors.username]} />
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

export default UsernameDialog;
