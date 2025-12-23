import { Routes, Route } from "react-router-dom";
import First from "./pages/First";
import PasswordForget from "./pages/PasswordForget"
import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<First />} />
      <Route path="/forgotpassword" element={<PasswordForget />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/ngo" element={<NgoDashboard />} />
      <Route path="/restaurant" element={<RestaurantDashboard />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;