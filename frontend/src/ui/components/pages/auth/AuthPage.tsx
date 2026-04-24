import { useState } from "react";
import { LoginForm } from "../../forms/LoginForm";
import { SignupForm } from "../../forms/SignupForm";

function AuthPage() {
  const [form, setForm] = useState<"login" | "signup">("login");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {form === "login" ? (
          <LoginForm setForm={setForm} />
        ) : (
          <SignupForm setForm={setForm} />
        )}
      </div>
    </div>
  );
}

export default AuthPage;
