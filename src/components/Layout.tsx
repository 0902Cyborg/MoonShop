import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NavigationBreadcrumb from "./NavigationBreadcrumb";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NavigationBreadcrumb />
      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
