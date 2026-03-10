import { LoginForm } from "@/components/auth/login-form";

export default function Page() {
  return (
    <div
      className={
        "flex flex-col min-h-screen items-center justify-center w-full"
      }
    >
      <LoginForm />
    </div>
  );
}
