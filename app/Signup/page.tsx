"use client";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string, pipe, nonEmpty, custom, boolean } from "valibot";

type UserData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
};


const schema = object({
  name: pipe(
    string(),
    custom((value) => (value as string).trim() !== "", "Name is required"),
    custom((value) => /^[A-Za-z\s]+$/.test(value as string), "Name must not contain numbers or special characters")
  ),
  username: pipe(
    string(),
    custom((value) => (value as string).trim() !== "", "Username is required"),
    custom((value) => (value as string).length >= 3, "Username must be at least 3 characters long")
  ),
  email: pipe(
    string(),
    custom((value) => (value as string).trim() !== "", "Phone number is required"),
    custom((value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value as string), "Please enter a valid email address")
  ),
  phone: pipe(
    string(),
    custom((value) => (value as string).trim() !== "", "Password is required"),
    custom((value) => /^\+?[0-9]\d{0,14}$/.test(value as string), "Please enter a valid phone number")
  ),
  password: pipe(
    string(),
    custom((value) => (value as string).trim() !== "", "Password is required"),
    custom((value) => (value as string).length >= 8, "Password must be at least 8 characters long")
  ),
  confirmPassword: string(),
  agreed: pipe(
    boolean(),
    custom((value) => value === true, "You must agree to the terms and conditions")
  ),
});


const SignUp = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<UserData>({
    resolver: valibotResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreed: false,
    },
  });

  const onSubmit = async (data: UserData) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error); // Use the specific error message from the server
      }

      await response.json();
      Swal.fire({
        title: "Success!",
        text: "User registered successfully!",
        icon: "success",
      });
      reset(); // Assuming 'reset' is a function to clear the form fields
    } catch (error: any) {
      console.error(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message, // Show the specific error message to the user
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between h-screen">
        <div className="bg-slate-200 flex-1 flex justify-center items-center">
          <img
            src="/images/sign/Paste_image-removebg-preview.png"
            alt="Sign Up"
            className="max-w-full h-auto"
          />
        </div>
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
                    helperText={errors.name?.message}
                  />
                )}
              />

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
                    helperText={errors.username?.message}
                  />
                )}
              />

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
                    helperText={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Your Phone"
                    variant="standard"
                    className="mt-4"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />

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
                    helperText={errors.password?.message}
                  />
                )}
              />

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
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />

              <div className="mt-6">
                <Controller
                  name="agreed"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox {...field} checked={field.value || false} />
                      }
                      label={
                        <Typography>
                          I agree with <strong>Privacy Policy</strong> and{" "}
                          <strong>Terms of Use</strong>
                        </Typography>
                      }
                    />
                  )}
                />
              </div>

              <div className="text-center mt-9">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 transition duration-300 ease-in-out"
                  sx={{ mt: 2 }}
                  disabled={!isValid}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
