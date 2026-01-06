import * as Yup from "yup";

const authSchema = Yup.object({
  mode: Yup.string().oneOf(["login", "signup"]).required(),

  role: Yup.string().required("Role is required"),

  name: Yup.string().when("mode", {
    is: "signup",
    then: () => Yup.string().required("Name is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),

  address: Yup.string().when(["mode", "role"], {
    is: (mode, role) => mode === "signup" && role !== "admin",
    then: () => Yup.string().required("Address is required"),
    otherwise: () => Yup.string().notRequired(),
  }),

  contactNo: Yup.string().when(["mode", "role"], {
    is: (mode, role) => mode === "signup" && role !== "admin",
    then: () =>
      Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit number")
        .required("Contact number is required"),
    otherwise: () => Yup.string().notRequired(),
  }),
});

export default authSchema;