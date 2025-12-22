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

  const getCoordinates = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const accuracy = pos.coords.accuracy; // meters

          // 🔴 Reject very inaccurate locations
          if (accuracy > 1000) {
            reject("Location accuracy too low. Please enable GPS.");
            return;
          }

          const coordinates = [
            Number(pos.coords.longitude),
            Number(pos.coords.latitude),
          ];

          console.log("Coordinates sent:", coordinates, "Accuracy:", accuracy);
          resolve(coordinates);
        },
        (err) => reject(err.message),
        {
          enableHighAccuracy: true, // 🔥 IMPORTANT
          timeout: 10000,
          maximumAge: 0
        }
      );
    });

  const handleSignup = async () => {
    try {
      let payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === "ngo" || role === "restaurant") {
        payload.coordinates = await getCoordinates();
      }
      if (role === "ngo") payload.address = form.address;

      await api.post("/auth/signup", payload);
      alert("Signup successful. Please login.");
      setIsSignup(false);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role,
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
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Signup" : "Login"}
        </h2>

        <select
          className="w-full border p-2 rounded mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="ngo">NGO</option>
          <option value="restaurant">Restaurant</option>
        </select>

        {isSignup && (
          <input
            className="w-full border p-2 rounded mb-3"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
        )}

        <input
          className="w-full border p-2 rounded mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        {isSignup && role === "ngo" && (
          <input
            className="w-full border p-2 rounded mb-3"
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={isSignup ? handleSignup : handleLogin}
        >
          {isSignup ? "Signup" : "Login"}
        </button>

        <p
          className="text-center text-sm mt-4 text-blue-600 cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}
        </p>

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