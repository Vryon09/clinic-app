import {
  handleGetClinicInfo,
  useUpdateClinicInfo,
} from "@/services/apiClinicInfo";
import type { IClinicInfo } from "@/types/ClinicInfo";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../../../shadcn/card";
import { Separator } from "../../../shadcn/separator";
import { Input } from "../../../shadcn/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../../shadcn/field";
import { Button } from "../../../shadcn/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clinicInfoSchema } from "@/schemas/clinicInfoSchema";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "../../../shadcn/spinner";

function GeneralSettings() {
  const { data: clinicInfo, isPending: isClinicInfoPending } =
    useQuery<IClinicInfo>({
      queryFn: handleGetClinicInfo,
      queryKey: ["clinicInfo"],
    });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: clinicInfo?.name || "",
      address: clinicInfo?.address || "",
      phone: clinicInfo?.phone || "",
    },
    resolver: zodResolver(clinicInfoSchema),
  });

  const { mutate: handleUpdateClinicInfo } = useUpdateClinicInfo();

  function onSubmit(data: IClinicInfo) {
    handleUpdateClinicInfo(data, {
      onSuccess: () => {
        toast.success("Clinic Information updated successfully!", {
          position: "top-center",
        });
      },
      onError: (err) => {
        toast.error(err.response?.data?.message, {
          position: "top-center",
        });
      },
    });
  }

  useEffect(() => {
    if (clinicInfo) {
      reset({
        name: clinicInfo.name || "",
        address: clinicInfo.address || "",
        phone: clinicInfo.phone || "",
      });
    }
  }, [clinicInfo, reset]);

  return (
    <Card className="space-y-4 px-8 py-4">
      <div>
        <p className="text-2xl font-semibold">General Settings</p>
        <p className="text-sm text-neutral-500">
          Configure and customize your clinic information
        </p>
      </div>

      <Separator />

      {isClinicInfoPending ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel className="capitalize" htmlFor="name">
                    name
                  </FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="name"
                    {...register("name")}
                    type="text"
                  />
                </div>
                {errors.name && (
                  <FieldError className="text-xs" errors={[errors.name]} />
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel className="capitalize" htmlFor="address">
                    address
                  </FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="address"
                    {...register("address")}
                    type="text"
                  />
                </div>
                {errors.address && (
                  <FieldError className="text-xs" errors={[errors.address]} />
                )}
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <div className="space-y-1">
                  <FieldLabel className="capitalize" htmlFor="phone">
                    phone
                  </FieldLabel>
                  <Input
                    className="border border-neutral-400"
                    id="phone"
                    {...register("phone")}
                    type="text"
                  />
                </div>
                {errors.phone && (
                  <FieldError className="text-xs" errors={[errors.phone]} />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="flex justify-end">
            <Button
              disabled={isClinicInfoPending}
              type="submit"
              className="mt-4 cursor-pointer"
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}

export default GeneralSettings;
