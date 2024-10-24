"use client";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import {
  Validator,
  required,
  maxLength,
  email,
  minLength,
  oneOf,
  matches,
} from "vailbot"; // Import Vailbot validators

// Define the validation schema using Vailbot
const validationSchema = new Validator({
  name: [
    required("Name is required"),
    matches(
      /^[A-Za-z\s]{1,30}$/,
      "Name must be less than 30 characters and only contain letters and spaces"
    ),
  ],
  username: [
    required("Username is required"),
    maxLength(30, "Username cannot exceed 30 characters"),
  ],
  email: [required("Email is required"), email("Email is not valid")],
  password: [
    required("Password is required"),
    minLength(6, "Password must be at least 6 characters"),
  ],
  confirmPassword: [
    oneOf("Passwords must match", "password"), // Reference the password field
    required("Confirm Password is required"),
  ],
  agreed: [required("You must agree with Privacy Policy and Terms of Use")],
});

const SignUp = () => {
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
  });

  const password = watch("password");

  // Handle form submission
  const onSubmit = async (data) => {
    const userData = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to register.");
      }

      const result = await response.json();
      Swal.fire({
        title: "Good Job!",
        text: "User registered successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error registering user!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between h-screen">
        {/* Left Section */}
        <div className="bg-slate-200 flex-1 flex justify-center items-center">
          <img
            src="/images/sign/Paste_image-removebg-preview.png"
            alt="Sign Up"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <div className="mx-auto md:w-8/12 lg:w-9/12">
            <h1 className="font-extrabold text-3xl">Sign Up</h1>
            <p className="mt-6">
              Already have an account?{" "}
              <Link href="/Signin" className="text-green-500">
                Sign in
              </Link>
            </p>

            <div className="flex flex-col">
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                rules={{ validate: validationSchema.name }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Your name"
                    variant="standard"
                    className="mt-4"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              {/* Username Field */}
              <Controller
                name="username"
                control={control}
                rules={{ validate: validationSchema.username }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="standard"
                    className="mt-4"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />

              {/* Email Field */}
              <Controller
                name="email"
                control={control}
                rules={{ validate: validationSchema.email }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="standard"
                    className="mt-4"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                rules={{ validate: validationSchema.password }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    variant="standard"
                    type="password"
                    className="mt-4"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ validate: validationSchema.confirmPassword }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    variant="standard"
                    type="password"
                    className="mt-4"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              {/* Agreement Checkbox */}
              <Controller
                name="agreed"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false} // Ensure checkbox is controlled
                        onChange={(e) =>
                          setValue("agreed", e.target.checked, {
                            shouldValidate: true,
                          })
                        }
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
                <p className="text-red-500">{errors.agreed.message}</p>
              )}

              {/* Submit Button - Disabled until all fields are valid */}
              <div className="text-center mt-9">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 translate duration-300 ease-in-out"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
