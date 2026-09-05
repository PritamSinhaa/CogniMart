import { Outlet } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import ScrollToTop from "../common/ScrollToTop";

export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}