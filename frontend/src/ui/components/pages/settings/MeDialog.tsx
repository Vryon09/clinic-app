import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMeSchema, type UpdateMeInput } from "@/schemas/authSchema";

interface IUserDialog {
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
}

function MeDialog({
  isUserDialogOpen,
  setIsUserDialogOpen,
  username,
}: IUserDialog) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      username,
    },
  });

  function onSubmit(data: UpdateMeInput) {
    console.log(data);
    console.log(errors);
  }

  return (
    <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            </FieldGroup>

            {
              <>
                <FieldGroup>
                  <Field>
                    <div className="space-y-1">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        className="border border-neutral-400"
                        id="password"
                        {...register("password")}
                        type="password"
                      />
                    </div>
                    {errors.password && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.password]}
                      />
                    )}
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <div className="space-y-1">
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        className="border border-neutral-400"
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        type="password"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <FieldError
                        className="text-xs"
                        errors={[errors.confirmPassword]}
                      />
                    )}
                  </Field>
                </FieldGroup>
              </>
            }
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

export default MeDialog;
