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

function GeneralSettings() {
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
    <Card className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
          <p className="text-xs text-muted-foreground">
            Configure and customize your clinic information
          </p>
        </div>

        <Button
          variant={isEditing ? "outline" : "default"}
          size="sm"
          className="gap-1.5 h-9"
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
          <Spinner className="size-8 text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldSet className="w-full space-y-4">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className="space-y-1.5 col-span-1 md:col-span-2">
                <FieldLabel className="text-xs font-semibold text-foreground/80 capitalize" htmlFor="name">
                  Clinic Name
                </FieldLabel>
                <Input
                  disabled={!isEditing}
                  className="h-10 rounded-lg border-border/80 bg-background disabled:bg-muted/40"
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="Enter clinic name"
                />
                {errors.name && (
                  <FieldError className="text-xs text-destructive" errors={[errors.name]} />
                )}
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-foreground/80 capitalize" htmlFor="address">
                  Clinic Address
                </FieldLabel>
                <Input
                  disabled={!isEditing}
                  className="h-10 rounded-lg border-border/80 bg-background disabled:bg-muted/40"
                  id="address"
                  {...register("address")}
                  type="text"
                  placeholder="Enter clinic address"
                />
                {errors.address && (
                  <FieldError className="text-xs text-destructive" errors={[errors.address]} />
                )}
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-foreground/80 capitalize" htmlFor="phone">
                  Phone Number
                </FieldLabel>
                <Input
                  disabled={!isEditing}
                  className="h-10 rounded-lg border-border/80 bg-background disabled:bg-muted/40"
                  id="phone"
                  {...register("phone")}
                  type="text"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <FieldError className="text-xs text-destructive" errors={[errors.phone]} />
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
                className="h-9 px-6 cursor-pointer font-medium shadow-xs"
              >
                Save Changes
              </Button>
            </div>
          )}
        </form>
      )}

      <div className="pt-4">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="size-5 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
          </div>
          <ResetDatabase />
        </div>
      </div>
    </Card>
  );
}

export default GeneralSettings;
