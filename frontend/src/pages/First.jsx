import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const First = () => {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("restaurant");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");

  const navigate = useNavigate();

  const getCoordinatesFromAddress = async (addr) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addr
      )}`
    );
    const data = await res.json();
    if (!data.length) throw new Error("Invalid address");
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        const payload = { name, email, password, role };

        if (role !== "admin") {
          payload.address = address;
          payload.contactNo = contactNo;
          payload.coordinates = await getCoordinatesFromAddress(address);
        }

        await api.post("/auth/signup", payload);
        alert("Signup successful. Please verify your email.");
        navigate("/verify-email", { state: { email, role } });
        return;
      }

      const { data } = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      navigate(`/${role}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-sm text-center text-indigo-200 mb-4">
          {mode === "login"
            ? "Login to continue making an impact"
            : "Join us in reducing food waste"}
        </p>

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

        {/* NAME */}
        {mode === "signup" && (
          <input
            className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        {/* EMAIL */}
        <input
          className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ADDRESS + CONTACT */}
        {mode === "signup" && role !== "admin" && (
          <>
            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Address (e.g. Rajendra Nagar, Indore)"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              className="bg-white/20 border border-white/30 rounded-lg p-2 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Contact Number"
              onChange={(e) => setContactNo(e.target.value)}
              required
            />
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "login" && (
          <p
            className="text-sm text-purple-300 cursor-pointer text-center hover:underline"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot password?
          </p>
        )}

        <button className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold shadow-lg">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center text-indigo-200 mt-2">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-purple-400 cursor-pointer hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-purple-400 cursor-pointer hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default First;