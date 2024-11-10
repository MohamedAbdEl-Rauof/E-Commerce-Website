import React from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { IoCartOutline } from "react-icons/io5";

const Step3 = () => {
  return (
    <div className="mx-auto mt-24 mb-14 text-center max-w-7xl px-4">
      {/* Container for the thank you message and order info */}
      <div className="border border-gray-200 rounded-lg shadow-lg p-8">
        {/* Thank You message */}
        <div className="mb-8">
          <p className="text-gray-500 text-xl">Thank You! 🎉</p>
          <h1 className="text-3xl font-bold text-gray-800">Your order has been received</h1>
        </div>

        {/* Order Badge (with image) */}
        <div className="pt-5 flex justify-center">
          <Badge badgeContent={2} color="primary" overlap="circular">
            <img
              src="/images/Bannar/Paste image.jpg"
              alt="Order Badge"
              className="rounded-2xl"
              width={80}
              height={80}
            />
          </Badge>
        </div>

        <div className="mt-10 mb-10 justify-center flex space-x-24">
          <div className="text-left font-bold">
            <h1 className="text-gray-500 text-xl">Order Code:</h1>
            <h1 className="text-gray-500 text-xl">Date:</h1>
            <h1 className="text-gray-500 text-xl">Total:</h1>
            <h1 className="text-gray-500 text-xl">Payment Method:</h1>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-semibold text-gray-800">#4533-543</h1>
            <h1 className="text-xl font-semibold text-gray-800">October 19, 2023</h1>
            <h1 className="text-xl font-semibold text-gray-800">$1,345</h1>
            <h1 className="text-xl font-semibold text-gray-800">Credit Card</h1>
          </div>
        </div>

        {/* Optional button for going back to shopping or viewing more details */}
        <div className="mt-8">
          <Button
            variant="contained"
            color="primary"
            className="w-full sm:w-auto rounded-xl"
          >
            Purchase History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
