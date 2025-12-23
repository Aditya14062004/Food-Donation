import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/api";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state?.email || !state?.role) {
    navigate("/");
    return null;
  }

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/auth/verify-email", {
        email: state.email,
        role: state.role,
        otp,
      });

      alert("Email verified successfully. Please login.");
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
        onSubmit={verifyOtp}
        className="bg-white w-80 p-8 rounded-lg shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Verify Email
        </h2>

        <p className="text-sm text-center text-gray-500">
          OTP sent to <b>{state.email}</b>
        </p>

        <input
          className="border rounded p-2"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;