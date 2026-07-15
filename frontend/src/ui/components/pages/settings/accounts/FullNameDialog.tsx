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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your account</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="firstName"
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
                  <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="middleName"
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
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="lastName"
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

export default FullNameDialog;
