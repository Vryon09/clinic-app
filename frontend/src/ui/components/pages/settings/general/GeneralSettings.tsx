import {
  handleGetClinicInfo,
  useInitClinicInfo,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../../../shadcn/spinner";
import { Edit, TriangleAlert, X } from "lucide-react";
import ResetDatabase from "./ResetDatabase";
import { useAccess } from "@/hooks/useAccess";
import TextSizeSettings from "./TextSizeSettings";
import ClinicLogoSection from "./ClinicLogoSection";

function GeneralSettings() {
  const { can, isReadOnly } = useAccess();
  const readOnly = isReadOnly("settings.general") || !can("clinic:update");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const {
    data: clinicInfo,
    isPending: isClinicInfoPending,
    isError: isClinicInfoError,
  } = useQuery<IClinicInfo>({
    queryFn: handleGetClinicInfo,
    queryKey: ["clinicInfo"],
    retry: false,
  });

  const { mutate: handleInitClinicInfo, isPending: isInitClinicInfoLoading } =
    useInitClinicInfo();

  useEffect(() => {
    if (isClinicInfoError || !clinicInfo) {
      handleInitClinicInfo();
    }
  }, [isClinicInfoError, clinicInfo, handleInitClinicInfo]);

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
        toast.success("Clinic Profile Saved", {
          description: "Clinic name, address, and contact number updated.",
        });
      },
      onError: (err) => {
        toast.error("Failed to Save Profile", {
          description:
            err.response?.data?.message ||
            "Could not update clinic information.",
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
    <div className="space-y-6">
      <Card className="border-border/80 bg-card space-y-6 rounded-xl border p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Clinic Information
            </h2>
            <p className="text-muted-foreground text-xs">
              Configure and customize your clinic details and contact
              information
            </p>
          </div>

          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            className="h-9 gap-1.5"
            disabled={readOnly}
            onClick={() => {
              if (isEditing) {
                reset();
              }
              setIsEditing((prev) => !prev);
            }}
          >
            {!isEditing ? (
              <>
                <Edit className="size-4" /> Edit Details
              </>
            ) : (
              <>
                <X className="size-4" /> Cancel
              </>
            )}
          </Button>
        </div>

        <Separator className="bg-border/60" />

        {isClinicInfoPending || isInitClinicInfoLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner className="text-primary size-8" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="w-full space-y-4">
              <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field className="col-span-1 space-y-1.5 md:col-span-2">
                  <FieldLabel
                    className="text-foreground/80 text-xs font-semibold capitalize"
                    htmlFor="name"
                  >
                    Clinic Name
                  </FieldLabel>
                  <Input
                    disabled={!isEditing}
                    className="border-border/80 bg-background disabled:bg-muted/40 h-10 rounded-lg"
                    id="name"
                    {...register("name")}
                    type="text"
                    placeholder="Enter clinic name"
                  />
                  {errors.name && (
                    <FieldError
                      className="text-destructive text-xs"
                      errors={[errors.name]}
                    />
                  )}
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel
                    className="text-foreground/80 text-xs font-semibold capitalize"
                    htmlFor="address"
                  >
                    Clinic Address
                  </FieldLabel>
                  <Input
                    disabled={!isEditing}
                    className="border-border/80 bg-background disabled:bg-muted/40 h-10 rounded-lg"
                    id="address"
                    {...register("address")}
                    type="text"
                    placeholder="Enter clinic address"
                  />
                  {errors.address && (
                    <FieldError
                      className="text-destructive text-xs"
                      errors={[errors.address]}
                    />
                  )}
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel
                    className="text-foreground/80 text-xs font-semibold capitalize"
                    htmlFor="phone"
                  >
                    Phone Number
                  </FieldLabel>
                  <Input
                    disabled={!isEditing}
                    className="border-border/80 bg-background disabled:bg-muted/40 h-10 rounded-lg"
                    id="phone"
                    {...register("phone")}
                    type="text"
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <FieldError
                      className="text-destructive text-xs"
                      errors={[errors.phone]}
                    />
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            {isEditing && (
              <div className="flex justify-end pt-2">
                <Button
                  disabled={isClinicInfoPending}
                  type="submit"
                  size="sm"
                  className="h-9 cursor-pointer px-6 font-medium shadow-xs"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        )}
      </Card>

      <ClinicLogoSection />

      <TextSizeSettings />

      {can("system:reset") && (
        <div className="border-destructive/20 bg-destructive/5 space-y-4 rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-destructive size-5" />
            <h3 className="text-destructive text-sm font-semibold">
              Danger Zone
            </h3>
          </div>
          <ResetDatabase />
        </div>
      )}
    </div>
  );
}

export default GeneralSettings;
