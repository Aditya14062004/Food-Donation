import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    role: "ngo",
    otp: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    await api.post("/auth/reset-password", form);
    alert("Password reset successful");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <select
          className="w-full border p-2 rounded mb-2"
          name="role"
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="ngo">NGO</option>
          <option value="restaurant">Restaurant</option>
        </select>

        <input className="w-full border p-2 mb-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="w-full border p-2 mb-2" name="otp" placeholder="OTP" onChange={handleChange} />
        <input type="password" className="w-full border p-2 mb-2" name="newPassword" placeholder="New Password" onChange={handleChange} />

        <button className="w-full bg-green-600 text-white py-2 rounded" onClick={submit}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;