import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("restaurant");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Get browser location
  const getCoordinates = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve([
            pos.coords.longitude,
            pos.coords.latitude
          ]),
        () => reject("Location permission denied")
      );
    });

  // Signup
  const handleSignup = async () => {
    try {
      let payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role
      };

      if (role === "ngo" || role === "restaurant") {
        payload.coordinates = await getCoordinates();
      }

      if (role === "ngo") payload.address = form.address;

      await api.post("/auth/signup", payload);
      alert("Signup successful! Please login.");
      setIsSignup(false);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // Login
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin");
      if (role === "ngo") navigate("/ngo");
      if (role === "restaurant") navigate("/restaurant");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        {/* Role */}
        <select
          className="w-full border p-2 rounded mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="ngo">NGO</option>
          <option value="restaurant">Restaurant</option>
        </select>

        {/* Name */}
        {isSignup && (
          <input
            className="w-full border p-2 rounded mb-3"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
        )}

        {/* Email */}
        <input
          className="w-full border p-2 rounded mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {/* Address (NGO only) */}
        {isSignup && role === "ngo" && (
          <input
            className="w-full border p-2 rounded mb-3"
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />
        )}

        {/* Action Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={isSignup ? handleSignup : handleLogin}
        >
          {isSignup ? "Signup" : "Login"}
        </button>

        {/* Toggle */}
        <p
          className="text-center text-sm mt-4 text-blue-600 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}
        </p>

        {/* Forgot password */}
        {!isSignup && (
          <p
            className="text-center text-sm mt-2 text-red-500 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;