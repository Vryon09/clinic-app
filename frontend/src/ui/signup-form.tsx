import { cn } from "@/lib/utils";

import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./components/field";
import { Input } from "./components/input";
import { Button } from "./components/button";

interface SignupFormProps {
  switchMode: () => void;
}

export function SignupForm({ switchMode }: SignupFormProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("flex w-full flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                </div>
                <Input id="confirm-password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" onClick={() => navigate("/home")}>
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a onClick={switchMode} href="#">
                    Log in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
