import { useState } from "react";
import "./App.css";
import AdminHome from "./pages/AdminHome";
import { Route, Routes } from "react-router-dom";
import AdminVendorPage from "./pages/AdminVendorPage";
import ManageDp from "./pages/ManageDp";
import VendorDetails from "./pages/VendorDetails";
import ErrorPage from "./pages/Error";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/vendor" element={<AdminVendorPage />} />
        <Route path="/manageDp" element={<ManageDp />} />
        <Route path="/vendorDetails/:id" element = {<VendorDetails />} />
        <Route path="*" element={<ErrorPage /> } />
      </Routes>

    </>
  );
}

export default App;
