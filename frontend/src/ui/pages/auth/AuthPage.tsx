import { LoginForm } from "@/ui/login-form";
import { SignupForm } from "@/ui/signup-form";
import { useState } from "react";

export function AuthPage() {
  const [form, setForm] = useState("login");

  function switchMode() {
    setForm((prev) => (prev === "signup" ? "login" : "signup"));
  }

  return (
    <div>
      <div className="w-125 mx-auto">
        {form === "signup" ? (
          <SignupForm switchMode={switchMode} />
        ) : (
          <LoginForm switchMode={switchMode} />
        )}
      </div>
    </div>
  );
}
