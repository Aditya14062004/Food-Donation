import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../api/api";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  if (!state?.email || !state?.role) {
    navigate("/");
    return null;
  }

  // ✅ VERIFY EMAIL MUTATION
  const verifyEmailMutation = useMutation({
    mutationFn: (payload) => api.post("/auth/verify-email", payload),
    onSuccess: () => {
      alert("Email verified successfully. Please login.");
      navigate("/");
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    },
  });

  const verifyOtp = (e) => {
    e.preventDefault();

    verifyEmailMutation.mutate({
      email: state.email,
      role: state.role,
      otp,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-4">
      <form
        onSubmit={verifyOtp}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 text-white"
      >
        <h2 className="text-2xl font-bold text-center">
          Verify Your Email
        </h2>

        <p className="text-sm text-center text-indigo-200">
          OTP sent to <span className="font-semibold">{state.email}</span>
        </p>

        <input
          className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          disabled={verifyEmailMutation.isPending}
          className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold shadow-lg disabled:opacity-50"
        >
          {verifyEmailMutation.isPending
            ? "Verifying..."
            : "Verify Email"}
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

export default VerifyEmail;