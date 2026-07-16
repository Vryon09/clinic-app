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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Full Name</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="firstName">Username</FieldLabel>
                <Input
                  className="border border-neutral-400"
                  id="firstName"
                  {...register("username")}
                  type="text"
                />
                {errors.username && (
                  <FieldError className="text-xs" errors={[errors.username]} />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end">
            <Button
              disabled={isUserLoading}
              type="submit"
              className="mt-4 cursor-pointer"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UsernameDialog;
