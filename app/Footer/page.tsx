import React from "react";
import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";

const Foter = () => {
  return (
    <Footer container>
      <div className="w-full pt-20 pb-16 bg-black text-white px-6 sm:px-16 md:px-24">
        <div className="flex flex-col sm:flex-row w-full sm:justify-between md:grid-cols-1 space-y-8 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-x-4 text-white">
            <h1 className="text-3xl">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>

            <div className="hidden sm:block border-l-2 border-gray-300 h-6"></div>
            <p>Gift & Decoration Store</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-white text-center sm:text-left">
            <Footer.Title title="Home" className="text-white" />
            <Footer.Title title="Shop" className="text-white" />
            <Footer.Title title="Product" className="text-white" />
            <Footer.Title title="Blog" className="text-white" />
            <Footer.Title title="Contact Us" className="text-white" />
          </div>
        </div>

        <hr className="my-4 border-gray-300 mt-16" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-white space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="sm:text-base md:text-base ">
              Copyright © 2023 3legant. All rights reserved
            </h1>
            <div className="flex space-x-5">
              <a href="#" className="text-white font-extrabold">
                Privacy Policy
              </a>
              <a href="#" className="text-white font-extrabold">
                Terms of Use
              </a>
            </div>
          </div>

          <div className="flex space-x-6 sm:justify-center text-white text-2xl">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsGithub} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default Foter;
