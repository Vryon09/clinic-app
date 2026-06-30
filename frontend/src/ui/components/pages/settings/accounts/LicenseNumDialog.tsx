import {
  changeLicenseNumSchema,
  type ChangeLicenseNumInput,
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
import { useChangeLicenseNum } from "@/services/apiAuth";
import type { IUser } from "@/types/User";

interface ILicenseNumDialog {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  user: IUser;
  isUserLoading: boolean;
}

function LicenseNumDialog({
  open,
  onOpenChange,
  user,
  isUserLoading,
}: ILicenseNumDialog) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changeLicenseNumSchema),
    defaultValues: { licenseNum: user.licenseNum },
  });

  const { mutate: handleChangeLicenseNum } = useChangeLicenseNum();

  function onSubmit(data: ChangeLicenseNumInput) {
    handleChangeLicenseNum(
      { licenseNum: data.licenseNum },
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
          <DialogTitle>Update License Number</DialogTitle>
        </DialogHeader>

        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel htmlFor="licenseNum">License Number</FieldLabel>
                  <Input
                    disabled={isUserLoading}
                    className="border border-neutral-400"
                    id="licenseNum"
                    {...register("licenseNum")}
                  />
                </div>
                {errors.licenseNum && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.licenseNum]}
                  />
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

export default LicenseNumDialog;
