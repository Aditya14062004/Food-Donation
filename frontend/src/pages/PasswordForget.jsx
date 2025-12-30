import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../api/api";

const inputClass =
  "bg-white/20 border border-white/30 rounded-lg px-4 py-2 mt-1 mb-1 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white";

const errorClass = "text-red-400 text-sm mb-2";

const PasswordForgot = () => {
  const navigate = useNavigate();

  const initialValues = {
    step: "otp",
    email: "",
    role: "restaurant",
    otp: "",
    newPassword: "",
  };

  const validationSchema = Yup.object({
    role: Yup.string().required("Role is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    otp: Yup.string().when("step", {
      is: "reset",
      then: () => Yup.string().required("OTP is required"),
    }),

    newPassword: Yup.string().when("step", {
      is: "reset",
      then: () =>
        Yup.string()
          .min(6, "Minimum 6 characters")
          .required("New password is required"),
    }),
  });

  const submitHandler = async (values, { setSubmitting, setFieldValue }) => {
    try {
      if (values.step === "otp") {
        await api.post("/auth/generate-otp", {
          email: values.email,
          role: values.role,
        });

        alert("OTP sent to your email");
        setFieldValue("step", "reset");
        return;
      }

      await api.post("/auth/reset-password", {
        email: values.email,
        role: values.role,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      alert("Password reset successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
      >
        {({ values, isSubmitting }) => (
          <Form className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 flex flex-col gap-3 text-white">
            <h2 className="text-2xl font-bold text-center">
              {values.step === "otp" ? "Forgot Password" : "Reset Password"}
            </h2>

            {/* ROLE */}
            <Field as="select" name="role" className={inputClass}>
              <option className="text-black" value="admin">
                Admin
              </option>
              <option className="text-black" value="ngo">
                NGO
              </option>
              <option className="text-black" value="restaurant">
                Restaurant
              </option>
            </Field>

            {/* EMAIL */}
            <Field
              name="email"
              type="email"
              placeholder="Email"
              className={inputClass}
            />
            <ErrorMessage name="email" component="p" className={errorClass} />

            {/* OTP + PASSWORD */}
            {values.step === "reset" && (
              <>
                <Field
                  name="otp"
                  placeholder="OTP"
                  className={inputClass}
                />
                <ErrorMessage name="otp" component="p" className={errorClass} />

                <Field
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  className={inputClass}
                />
                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className={errorClass}
                />
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold shadow-lg disabled:opacity-50"
            >
              {isSubmitting
                ? "Please wait..."
                : values.step === "otp"
                ? "Send OTP"
                : "Reset Password"}
            </button>

            <p
              className="text-sm text-center text-purple-300 cursor-pointer hover:underline mt-2"
              onClick={() => navigate("/")}
            >
              Back to Login
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PasswordForgot;