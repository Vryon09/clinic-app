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
import { Separator } from "../shadcn/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/schemas/authSchema";
import { useRegister } from "@/services/apiAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const { mutate: handleRegister, isPending: isSigningup } = useRegister();
  const navigate = useNavigate();

  function onSubmit(data: SignupInput) {
    handleRegister(
      { username: data.username, password: data.password, role: "ADMIN" },
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
      <Card className="px-3 pt-4 pb-8">
        <CardHeader className="my-4">
          <CardTitle className="mb-1 text-center text-2xl leading-1">
            ClinicSync
          </CardTitle>
          <CardDescription className="text-center text-xs">
            Staff Portal
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  className="border-neutral-300"
                  id="username"
                  type="text"
                  {...register("username")}
                  required
                />
                {errors.username && (
                  <FieldError className="text-xs" errors={[errors.username]} />
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>

                <div className="relative">
                  <Input
                    className="border-neutral-300"
                    id="password"
                    type={isPasswordShowing ? "text" : "password"}
                    {...register("password")}
                    required
                  />

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordShowing((prev) => !prev);
                    }}
                    variant="ghost"
                    size="icon-lg"
                    className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-2 hover:bg-transparent"
                  >
                    {!isPasswordShowing ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>

                {errors.password && (
                  <FieldError className="text-xs" errors={[errors.password]} />
                )}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                </div>

                <div className="relative">
                  <Input
                    className="border-neutral-300"
                    id="confirmPassword"
                    type={isPasswordShowing ? "text" : "password"}
                    {...register("confirmPassword")}
                    required
                  />

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPasswordShowing((prev) => !prev);
                    }}
                    variant="ghost"
                    size="icon-lg"
                    className="absolute top-1/2 right-0 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-2 hover:bg-transparent"
                  >
                    {!isPasswordShowing ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>

                {errors.confirmPassword && (
                  <FieldError
                    className="text-xs"
                    errors={[errors.confirmPassword]}
                  />
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSigningup}>
                  Sign up
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
