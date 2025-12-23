import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const First = () => {
  const [mode, setMode] = useState("login"); // login | signup
  const [role, setRole] = useState("restaurant");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");

  const navigate = useNavigate();

  // Convert address → coordinates (OpenStreetMap)
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
      // ================= SIGNUP =================
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

      // ================= LOGIN =================
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <form
        onSubmit={submitHandler}
        className="bg-white w-80 sm:w-[360px] p-8 rounded-lg shadow-xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          {mode === "login" ? "Login" : "Sign Up"}
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

        {/* NAME */}
        {mode === "signup" && (
          <input
            className="border rounded p-2"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        {/* EMAIL */}
        <input
          className="border rounded p-2"
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          className="border rounded p-2"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ADDRESS + CONTACT */}
        {mode === "signup" && role !== "admin" && (
          <>
            <input
              className="border rounded p-2"
              placeholder="Address (e.g. Rajendra Nagar, Indore)"
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              className="border rounded p-2"
              placeholder="Contact Number"
              onChange={(e) => setContactNo(e.target.value)}
              required
            />
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "login" && (
          <p
            className="text-sm text-red-500 cursor-pointer text-center"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot password?
          </p>
        )}

        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setMode("signup")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
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