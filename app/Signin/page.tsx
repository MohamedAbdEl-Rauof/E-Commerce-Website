"use client";
import { TextField } from "@mui/material";
import Link from "next/link";
import Swal from "sweetalert2"; 
import { useState } from "react";
import { useRouter } from "next/navigation"; 

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const result = await response.json();
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
      });

      // Redirect based on user type
      if (result.message === "Admin login successful") {
        router.push("/admin/dashboard"); 
      } else {
        router.push("/pages/Home"); 
      }

    } catch (error) {
      console.error("Sign-in error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An unexpected error occurred.",
      });
    }
  };

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
          <h1 className="font-extrabold text-3xl">Sign in</h1>
          <p className="mt-6">
            Don’t have an account yet?{" "}
            <Link href="/Signup" className="text-green-500">
              Sign up
            </Link>
          </p>
          <form onSubmit={onSubmit} className="flex flex-col mt-6">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              className="mt-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type="password"
              className="mt-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-center mt-9">
              <button
                type="submit"
                className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 translate duration-300 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
