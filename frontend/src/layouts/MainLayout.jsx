
import AnnouncementBar from "@/components/layout/announcement/AnnouncementBar";
import Footer from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/layout/navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <AnnouncementBar />

      <Header />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
