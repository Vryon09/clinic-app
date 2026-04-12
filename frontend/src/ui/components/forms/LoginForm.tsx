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
import { loginSchema, type LoginInput } from "@/schemas/loginSchema";
import { useNavigate } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();

  function onSubmit(data: LoginInput) {
    console.log(data);
    navigate("/patients");
  }

  if (errors) {
    console.log(errors);
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
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  className="border-neutral-300"
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
                {errors.password && (
                  <FieldError className="text-xs" errors={[errors.password]} />
                )}
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer">
                  Login
                </Button>
                {/* <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
