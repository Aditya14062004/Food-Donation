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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-4">
      <form
        onSubmit={step === "otp" ? generateOtp : resetPassword}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 text-white"
      >
        <h2 className="text-2xl font-bold text-center">
          {step === "otp" ? "Forgot Password" : "Reset Password"}
        </h2>

        {/* ROLE */}
        <select
          className="bg-white/20 border border-white/30 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option className="text-black" value="admin">Admin</option>
          <option className="text-black" value="ngo">NGO</option>
          <option className="text-black" value="restaurant">Restaurant</option>
        </select>

        {/* EMAIL */}
        <input
          className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {step === "reset" && (
          <>
            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold shadow-lg disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : step === "otp"
            ? "Send OTP"
            : "Reset Password"}
        </button>

        <p
          className="text-sm text-center text-purple-300 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default PasswordForgot;