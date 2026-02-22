import { LoginForm } from "@/ui/login-form";
import { SignupForm } from "@/ui/signup-form";
import { useState } from "react";

export function AuthPage() {
  const [form, setForm] = useState("login");

  function switchMode() {
    setForm((prev) => (prev === "signup" ? "login" : "signup"));
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-125">
        {form === "signup" ? (
          <SignupForm switchMode={switchMode} />
        ) : (
          <LoginForm switchMode={switchMode} />
        )}
      </div>
    </div>
  );
}
