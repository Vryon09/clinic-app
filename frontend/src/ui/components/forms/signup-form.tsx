import { useNavigate } from "react-router";
import { Card, CardContent } from "../shadcn/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../shadcn/field";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Lock, Mail, UserIcon } from "lucide-react";

interface SignupFormProps {
  switchMode: () => void;
}

export function SignupForm({ switchMode }: SignupFormProps) {
  const navigate = useNavigate();

  return (
    <Card className="">
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative">
                <UserIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field>
              <Button
                className="bg-blue-600 text-white shadow hover:bg-blue-700"
                type="submit"
                onClick={() => navigate("/home")}
              >
                Login
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a onClick={switchMode} href="#">
                  Sign up
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
