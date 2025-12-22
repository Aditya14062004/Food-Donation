import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const PasswordForgot = () => {
  const [step, setStep] = useState("otp"); // otp | reset
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("restaurant");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/generate-otp", { email, role });
      alert("OTP sent to your email");
      setStep("reset");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        role,
        otp,
        newPassword,
      });
      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <form
        onSubmit={step === "otp" ? generateOtp : resetPassword}
        className="bg-white w-80 sm:w-[360px] p-8 rounded-lg shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {step === "otp" ? "Forgot Password" : "Reset Password"}
        </h2>

        {/* ROLE */}
        <select
          className="border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="ngo">NGO</option>
          <option value="restaurant">Restaurant</option>
        </select>

        {/* EMAIL */}
        <input
          className="border rounded p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {step === "reset" && (
          <>
            <input
              className="border rounded p-2"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              className="border rounded p-2"
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </>
        )}

        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
        >
          {loading
            ? "Please wait..."
            : step === "otp"
            ? "Send OTP"
            : "Reset Password"}
        </button>

        <p
          className="text-sm text-center text-blue-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default PasswordForgot;