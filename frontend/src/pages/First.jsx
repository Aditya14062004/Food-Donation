import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import api from "../api/api";

const inputClass =
  "bg-white/20 border border-white/30 rounded-lg px-4 py-2 mt-1 mb-1 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white";

const errorClass = "text-red-400 text-sm mb-2";

const First = () => {
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

  // 🔐 LOGIN MUTATION
  const loginMutation = useMutation({
    mutationFn: (payload) => api.post("/auth/login", payload),
    onSuccess: ({ data }, variables) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", variables.role);
      navigate(`/${variables.role}`);
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    },
  });

  // 📝 SIGNUP MUTATION
  const signupMutation = useMutation({
    mutationFn: (payload) => api.post("/auth/signup", payload),
    onSuccess: (_, variables) => {
      alert("Signup successful. Please verify your email.");
      navigate("/verify-email", {
        state: { email: variables.email, role: variables.role },
      });
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message);
    },
  });

  const initialValues = {
    mode: "login",
    role: "restaurant",
    name: "",
    email: "",
    password: "",
    address: "",
    contactNo: "",
  };

  const validationSchema = Yup.object({
    role: Yup.string().required(),

    name: Yup.string().when("mode", {
      is: "signup",
      then: () => Yup.string().required("Name is required"),
    }),

    email: Yup.string().email("Invalid email").required("Email is required"),

    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),

    address: Yup.string().when(["mode", "role"], {
      is: (mode, role) => mode === "signup" && role !== "admin",
      then: () => Yup.string().required("Address is required"),
    }),

    contactNo: Yup.string().when(["mode", "role"], {
      is: (mode, role) => mode === "signup" && role !== "admin",
      then: () =>
        Yup.string()
          .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
          .required("Contact number is required"),
    }),
  });

  const submitHandler = async (values) => {
    const { mode, role } = values;

    if (mode === "signup") {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role,
      };

      if (role !== "admin") {
        payload.address = values.address;
        payload.contactNo = values.contactNo;
        payload.coordinates = await getCoordinatesFromAddress(values.address);
      }

      signupMutation.mutate(payload);
      return;
    }

    loginMutation.mutate({
      email: values.email,
      password: values.password,
      role,
    });
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue }) => (
          <Form className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col gap-3 text-white">
            <h2 className="text-2xl font-bold text-center">
              {values.mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <Field as="select" name="role" className={inputClass}>
              <option className="text-black" value="admin">Admin</option>
              <option className="text-black" value="ngo">NGO</option>
              <option className="text-black" value="restaurant">Restaurant</option>
            </Field>

            {values.mode === "signup" && (
              <>
                <Field name="name" placeholder="Name" className={inputClass} />
                <ErrorMessage name="name" component="p" className={errorClass} />
              </>
            )}

            <Field name="email" type="email" placeholder="Email" className={inputClass} />
            <ErrorMessage name="email" component="p" className={errorClass} />

            <Field name="password" type="password" placeholder="Password" className={inputClass} />
            <ErrorMessage name="password" component="p" className={errorClass} />

            {values.mode === "signup" && values.role !== "admin" && (
              <>
                <Field name="address" placeholder="Address" className={inputClass} />
                <ErrorMessage name="address" component="p" className={errorClass} />

                <Field name="contactNo" placeholder="Contact Number" className={inputClass} />
                <ErrorMessage name="contactNo" component="p" className={errorClass} />
              </>
            )}

            {/* FORGOT PASSWORD */} 
            {values.mode === "login" && ( <p className="text-sm text-purple-300 cursor-pointer text-center hover:underline"
              onClick={() => navigate("/forgotpassword")} > 
              Forgot password? 
            </p>)}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold shadow-lg"
            >
              {isLoading
                ? "Please wait..."
                : values.mode === "login"
                ? "Login"
                : "Sign Up"}
            </button>

            <p className="text-sm text-center text-indigo-200 mt-2">
              {values.mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    className="text-purple-400 cursor-pointer hover:underline"
                    onClick={() => setFieldValue("mode", "signup")}
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-purple-400 cursor-pointer hover:underline"
                    onClick={() => setFieldValue("mode", "login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default First;