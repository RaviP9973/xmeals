import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import Providers from "./context/provider.jsx";
import { ToastProvider } from "./components/customtoast/CustomToast.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <Providers>
        <App />
      </Providers>
    </ToastProvider>
    <ToastContainer />
  </BrowserRouter>
);
