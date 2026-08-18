import { Outlet } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}