import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import Link from "next/link";

const Signin = () => {
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
            Don’t have an accout yet?{" "}
            <Link href="/Signup" className="text-green-500">
              Sign up
            </Link>
          </p>
          <div className="flex flex-col mt-6">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              className="mt-4"
            />

            <TextField
              id="password"
              label="Password"
              variant="standard"
              className="mt-4"
            />
          </div>

          <div className="text-center mt-9">
            <button className="bg-black text-white rounded w-full h-10 md:w-72 hover:bg-neutral-700 translate duration-300 ease-in-out">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
