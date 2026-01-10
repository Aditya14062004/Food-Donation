const yup = require("yup");

const roleEnum = ["admin", "ngo", "restaurant"];

// ================= SIGNUP =================
exports.signupSchema = yup.object({
  name: yup.string().required("Name is required"),

  email: yup.string().email().required(),

  password: yup.string().min(6).required(),

  role: yup.string().oneOf(roleEnum).required(),

  address: yup.string().when("role", {
    is: (role) => role !== "admin",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired(),
  }),

  contactNo: yup.string().when("role", {
    is: (role) => role !== "admin",
    then: (schema) =>
      schema
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required(),
    otherwise: (schema) => schema.notRequired(),
  }),

  coordinates: yup
    .array()
    .of(yup.number())
    .length(2)
    .when("role", {
      is: (role) => role !== "admin",
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
});

// ================= VERIFY EMAIL =================
exports.verifyEmailSchema = yup.object({
  email: yup.string().email().required(),
  role: yup.string().oneOf(roleEnum).required(),
  otp: yup.string().length(6).required(),
});

// ================= LOGIN =================
exports.loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
  role: yup.string().oneOf(roleEnum).required(),
});

// ================= FORGOT PASSWORD =================
exports.generateOtpSchema = yup.object({
  email: yup.string().email().required(),
  role: yup.string().oneOf(roleEnum).required(),
});

// ================= RESET PASSWORD =================
exports.resetPasswordSchema = yup.object({
  email: yup.string().email().required(),
  role: yup.string().oneOf(roleEnum).required(),
  otp: yup.string().length(6).required(),
  newPassword: yup.string().min(6).required(),
});