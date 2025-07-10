import { AuthProvider } from "./authContext";
import { DpProvider } from "./dpContext";
import { VendorProvider } from "./vendorContext";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <DpProvider>
        <VendorProvider>{children}</VendorProvider>
      </DpProvider>
    </AuthProvider>
  );
};

export default Providers;
