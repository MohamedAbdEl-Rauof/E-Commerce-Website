"use client";
import { TextField, Checkbox, FormControlLabel, Typography, NoSsr } from "@mui/material";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";

type UserData = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
};

const SignUp = () => {
  const { control, handleSubmit, reset } = useForm({
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

  const onSubmit:SubmitHandler<UserData> = async (data) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to register.");

      await response.json();
      Swal.fire({
        title: "Success!",
        text: "User registered successfully!",
        icon: "success",
      });
      reset();
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
                  />
                )}
              />

              <div className="mt-6">
                <Controller
                  name="agreed"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value || false} />}
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
                <button
                  type="submit"
                  className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 transition duration-300 ease-in-out"
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
