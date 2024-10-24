"use client";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

// Define a validation schema with yup
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Name cannot exceed 30 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name must contain only letters and spaces"),
  username: yup
    .string()
    .required("Username is required")
    .max(30, "Username cannot exceed 30 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email is not valid"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
  agreed: yup
    .bool()
    .oneOf([true], "You must agree to the terms and conditions"),
});

const SignUp = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const password = watch("password");

  return (
    <div className="flex justify-between h-screen">
      {/* Left */}
      <div className="bg-slate-200 flex-1 flex justify-center items-center">
        <img
          src="/images/sign/Paste_image-removebg-preview.png"
          alt="Sign Up"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        <div className="mx-auto md:w-8/12 lg:w-9/12">
          <h1 className="font-extrabold text-3xl">Sign Up</h1>
          <p className="mt-6">
            Already have an account?{" "}
            <Link href="/Signin" className="text-green-500">
              Sign in
            </Link>
          </p>

          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Your name"
                variant="standard"
                className="mt-4"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            )}
          />

          {/* Username Field */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                variant="standard"
                className="mt-4"
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="standard"
                className="mt-4"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                variant="standard"
                type="password"
                className="mt-4"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            )}
          />

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                variant="standard"
                type="password"
                className="mt-4"
                error={!!errors.confirmPassword}
                helperText={
                  errors.confirmPassword ? errors.confirmPassword.message : ""
                }
              />
            )}
          />

          {/* Agree Checkbox */}
          <Controller
            name="agreed"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => setValue("agreed", e.target.checked)}
                  />
                }
                label={
                  <Typography>
                    I agree with <strong>Privacy Policy</strong> and{" "}
                    <strong>Terms of Use</strong>
                  </Typography>
                }
                className="mt-6"
              />
            )}
          />
          {errors.agreed && (
            <Typography color="error" variant="caption">
              {errors.agreed.message}
            </Typography>
          )}

          {/* Submit Button */}
          <div className="text-center mt-9">
            <button
              className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 transition duration-300 ease-in-out"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
