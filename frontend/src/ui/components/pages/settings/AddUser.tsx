import { useForm, Controller } from "react-hook-form";
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
import { addUserSchema, type AddUserInput } from "@/schemas/authSchema";
import { Card } from "../../shadcn/card";
import { cn } from "@/lib/utils";
import { useRegister } from "@/services/apiAuth";
import { toast } from "sonner";

interface IAddUser {
  isAddingUser: boolean;
  setIsAddingUser: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddUser({ isAddingUser, setIsAddingUser }: IAddUser) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addUserSchema) });

  const { mutate: handleRegister } = useRegister();

  function onSubmit(data: AddUserInput) {
    handleRegister(
      {
        username: data.username,
        password: data.password,
        role: data.role,
      },
      {
        onSuccess: () => {
          reset();
          setIsAddingUser(false);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message, { position: "top-center" });
        },
      },
    );
  }

  return (
    <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  className="border border-neutral-400"
                  id="username"
                  {...register("username")}
                  type="text"
                />
                {errors.username && (
                  <FieldError className="text-xs" errors={[errors.username]} />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  className="border border-neutral-400"
                  id="password"
                  {...register("password")}
                  type="password"
                />
                {errors.password && (
                  <FieldError className="text-xs" errors={[errors.password]} />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  className="border border-neutral-400"
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type="password"
                />
                {errors.confirmPassword && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.confirmPassword]}
                  />
                )}
              </Field>

              <Field>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="grid w-full grid-cols-3 gap-2">
                      <Card
                        onClick={() => field.onChange("ADMIN")}
                        className={cn(
                          "cursor-pointer px-2 py-3 text-center font-semibold",
                          field.value === "ADMIN"
                            ? "bg-neutral-950 text-white"
                            : "",
                        )}
                      >
                        Admin
                      </Card>

                      <Card
                        onClick={() => field.onChange("DOCTOR")}
                        className={cn(
                          "cursor-pointer px-2 py-3 text-center font-semibold",
                          field.value === "DOCTOR"
                            ? "bg-neutral-950 text-white"
                            : "",
                        )}
                      >
                        Doctor
                      </Card>

                      <Card
                        onClick={() => field.onChange("ASSISTANT")}
                        className={cn(
                          "cursor-pointer px-2 py-3 text-center font-semibold",
                          field.value === "ASSISTANT"
                            ? "bg-neutral-950 text-white"
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

export default AddUser;
