import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <Outlet />
    </main>
  );
}

export default AuthLayout;