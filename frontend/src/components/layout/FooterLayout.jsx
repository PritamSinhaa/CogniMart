import { Outlet } from "react-router-dom";

import Footer from "./footer/Footer";

export default function FooterLayout() {
  return (
    <>
      <Outlet />

      <Footer />
    </>
  );
}