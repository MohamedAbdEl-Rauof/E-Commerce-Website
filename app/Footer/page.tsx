import React from 'react';
import { Footer } from "flowbite-react";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";

const Foter = () => {
    return (
        <Footer container>
            <div className="w-full pt-20 pb-16 bg-black">
                <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
                    <div className="flex">
                        <h1 className="">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>
                        <div className="hidden sm:block mx-4 border-l border-gray-300 h-6"></div>
                        <p>Gift & Decoration Store</p>
                    </div>

                    {/* Vertical line separator */}

                    <div className="flex flex-wrap gap-8 sm:gap-6">
                        <div>
                            <Footer.Title title="Home" />
                        </div>
                        <div>
                            <Footer.Title title="Shop" />
                        </div>
                        <div>
                            <Footer.Title title="Product" />
                        </div>
                        <div>
                            <Footer.Title title="Blog" />
                        </div>
                        <div>
                            <Footer.Title title="Contact Us" />
                        </div>
                    </div>
                </div>

                {/* Horizontal line */}
                <hr className="my-4 border-gray-300 mt-16" />

                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <h1>Copyright © 2023 3legant. All rights reserved</h1>

                    {/* Links for Privacy Policy and Terms of Use */}
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
                        <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Use</a>
                    </div>

                    <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export default Foter;
