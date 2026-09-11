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
import { loginSchema, type LoginInput } from "@/schemas/authSchema";
import { useLogin } from "../../../services/apiAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Eye, EyeClosed, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { mutate: handleLogin, isPending: isLoggingin } = useLogin();

  const navigate = useNavigate();

  function onSubmit(data: LoginInput) {
    handleLogin(data, {
      onSuccess: () => {
        toast.success("Login successful", { position: "top-center" });
        navigate("/patients");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message, { position: "top-center" });
      },
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2 shadow-sm backdrop-blur-sm">
        <CardHeader className="space-y-4 px-6 pt-6 pb-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
            <ShieldCheck className="size-6 text-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                ClinicSync
              </CardTitle>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                Staff
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Clinical Operating System & Patient Records
            </CardDescription>
          </div>
        </CardHeader>

        <div className="mx-6 border-t border-border/60" />

        <CardContent className="px-6 pt-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel
                  htmlFor="username"
                  className="text-xs font-medium text-foreground/90"
                >
                  Username
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-10 rounded-lg border-border/80 bg-background/50 pr-3 pl-9 text-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                    id="username"
                    type="text"
                    placeholder="Enter staff username"
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
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-medium text-foreground/90"
                >
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    className="h-10 rounded-lg border-border/80 bg-background/50 pr-10 pl-9 text-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20"
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
                    {!isPasswordShowing ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>

                {errors.password && (
                  <FieldError className="text-xs" errors={[errors.password]} />
                )}
              </Field>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoggingin}
                  className="h-10 w-full cursor-pointer rounded-lg font-medium shadow-xs transition-all hover:shadow-sm"
                >
                  {isLoggingin ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In to Workstation"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <div className="border-t border-border/40 bg-muted/30 px-6 py-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            Protected Healthcare Portal · HIPAA Compliant Access
          </p>
        </div>
      </Card>
    </div>
  );
}
