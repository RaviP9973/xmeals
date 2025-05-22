import { useState } from "react";
import "./App.css";
import AdminHome from "./pages/AdminHome";
import { Route, Routes } from "react-router-dom";
import AdminVendorPage from "./pages/AdminVendorPage";
import ManageDp from "./pages/ManageDp";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/vendor" element={<AdminVendorPage />} />
        <Route path="/manageDp" element={<ManageDp />} />
      </Routes>

    </>
  );
}

export default App;
