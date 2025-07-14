import { useState } from "react";
import "./App.css";
import AdminHome from "./pages/AdminHome";
import { Route, Routes } from "react-router-dom";
import AdminVendorPage from "./pages/AdminVendorPage";
import ManageDp from "./pages/ManageDp";
import VendorDetails from "./pages/VendorDetails";
import ErrorPage from "./pages/Error";
import CuisineManager from "./pages/CuisineManager";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedGuestRoute from "./routes/ProtectedGuestRoute";
import Otp from "./pages/login/Otp";
import Login from "./pages/login/Login";
import UserDetailsForm from "./pages/user/UserDetailsForm";
import AdminRequestPending from "./pages/AdminRequest/AdminRequestPending";
import OfferBannerList from "./pages/offerBanner/OfferBanner";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import OrdersNotDelivered from "./pages/ordersNotDelivered/OrdersNotDelivered";

function App() {
  return (
    <div className="poppins-regular">
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AdminHome />} />
          <Route path="/admin/vendor" element={<AdminVendorPage />} />
          <Route path="/manageDp" element={<ManageDp />} />
          <Route path="/vendorDetails/:id" element={<VendorDetails />} />
          <Route path="/admin/cuisines" element={<CuisineManager />} />
          <Route path="/offers" element={<OfferBannerList />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/orders" element={<OrdersNotDelivered />} />
        </Route>
        <Route
          path="/login"
          element={
            <ProtectedGuestRoute>
              <Login />
            </ProtectedGuestRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <ProtectedGuestRoute>
              <Otp />
            </ProtectedGuestRoute>
          }
        />

        {/* <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        /> */}

        <Route
          path="/adminRequestPending"
          element={
            <ProtectedAdminRoute>
              <AdminRequestPending />
            </ProtectedAdminRoute>
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
