import { Outlet } from "react-router-dom";

import Navbar from "./navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}