import { cn } from "@/lib/utils";
import { Button } from "@/ui/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/shadcn/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/ui/components/shadcn/field";
import { Input } from "@/ui/components/shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/schemas/authSchema";
import { useRegister } from "@/services/apiAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeClosed, Loader2, Lock, ShieldPlus, User } from "lucide-react";

interface SignupFormProps extends React.ComponentProps<"div"> {
  onBack?: () => void;
}

export function SignupForm({
  className,
  onBack,
  ...props
}: SignupFormProps) {
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);
  const [isConfirmPasswordShowing, setIsConfirmPasswordShowing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const { mutate: handleRegister, isPending: isSigningup } = useRegister();
  const navigate = useNavigate();

  function onSubmit(data: SignupInput) {
    handleRegister(
      {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        role: "ADMIN",
        licenseNum: "",
      },
      {
        onSuccess: () => {
          toast.success("Sign up successful", { position: "top-center" });
          navigate("/patients");
        },
        onError: (err) => {
          toast.error(err.response?.data?.message, { position: "top-center" });
        },
      },
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2 shadow-sm backdrop-blur-sm">
        <CardHeader className="space-y-4 px-6 pt-6 pb-4">
          {onBack && (
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="-ml-2 h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="size-3.5" />
                Back to setup options
              </Button>
            </div>
          )}

          <div className="text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
              <ShieldPlus className="size-6 text-primary" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                  ClinicSync
                </CardTitle>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                  Admin Setup
                </span>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Configure your administrator account to initialize the practice
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="mx-6 border-t border-border/60" />

        <CardContent className="px-6 pt-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              {/* Name Fields */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Practitioner Information
                </span>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <Field>
                    <FieldLabel htmlFor="firstName" className="text-xs text-foreground/90 font-medium">
                      First Name
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="firstName"
                      placeholder="e.g. Sarah"
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
                    <FieldLabel htmlFor="middleName" className="text-xs text-foreground/90 font-medium">
                      Middle Name
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="middleName"
                      placeholder="Optional"
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
                    <FieldLabel htmlFor="lastName" className="text-xs text-foreground/90 font-medium">
                      Last Name
                    </FieldLabel>
                    <Input
                      className="h-9 rounded-lg border-border/80 bg-background/50 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="lastName"
                      placeholder="e.g. Jenkins"
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
              </div>

              {/* Account Credentials */}
              <div className="space-y-4 pt-1">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Workstation Credentials
                </span>

                <Field>
                  <FieldLabel htmlFor="username" className="text-xs text-foreground/90 font-medium">
                    Username
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      className="h-10 rounded-lg border-border/80 bg-background/50 pr-3 pl-9 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="username"
                      placeholder="Choose admin username"
                      type="text"
                      {...register("username")}
                      required
                    />
                    <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {errors.username && (
                    <FieldError className="text-xs" errors={[errors.username]} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="password" className="text-xs text-foreground/90 font-medium">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      className="h-10 rounded-lg border-border/80 bg-background/50 pr-10 pl-9 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="password"
                      placeholder="••••••••"
                      type={isPasswordShowing ? "text" : "password"}
                      {...register("password")}
                      required
                    />
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordShowing((prev) => !prev);
                      }}
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1/2 right-1 size-8 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                      title={isPasswordShowing ? "Hide password" : "Show password"}
                    >
                      {!isPasswordShowing ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <FieldError className="text-xs" errors={[errors.password]} />
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-xs text-foreground/90 font-medium">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      className="h-10 rounded-lg border-border/80 bg-background/50 pr-10 pl-9 text-sm focus-visible:border-primary focus-visible:ring-primary/20"
                      id="confirmPassword"
                      placeholder="••••••••"
                      type={isConfirmPasswordShowing ? "text" : "password"}
                      {...register("confirmPassword")}
                      required
                    />
                    <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsConfirmPasswordShowing((prev) => !prev);
                      }}
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute top-1/2 right-1 size-8 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                      title={isConfirmPasswordShowing ? "Hide password" : "Show password"}
                    >
                      {!isConfirmPasswordShowing ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <FieldError
                      className="text-xs"
                      errors={[errors.confirmPassword]}
                    />
                  )}
                </Field>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={isSigningup}
                  className="h-10 w-full cursor-pointer rounded-lg font-medium shadow-xs transition-all hover:shadow-sm"
                >
                  {isSigningup ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Initialize Clinic & Account"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <div className="border-t border-border/40 bg-muted/30 px-6 py-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            Administrative Setup · HIPAA Compliant Master Account
          </p>
        </div>
      </Card>
    </div>
  );
}
