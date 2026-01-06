import * as Yup from "yup";

const passwordForgetSchema = Yup.object({
  step: Yup.string()
    .oneOf(["otp", "reset"])
    .required(),

  role: Yup.string()
    .oneOf(["admin", "ngo", "restaurant"])
    .required("Role is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  otp: Yup.string().when("step", {
    is: "reset",
    then: () =>
      Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  newPassword: Yup.string().when("step", {
    is: "reset",
    then: () =>
      Yup.string()
        .min(6, "Minimum 6 characters")
        .required("New password is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

export default passwordForgetSchema;