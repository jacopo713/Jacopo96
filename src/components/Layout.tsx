import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {" "}
        {/* Padding per evitare che il contenuto sia coperto dalla navbar */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
