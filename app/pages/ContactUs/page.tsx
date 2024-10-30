import React from 'react';
import Header from "../../components/Header/page";
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa6";
import { CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

const ContactUs = () => {
    return (
        <div>
            <Header />
            <div className="w-[90%] mx-auto">
                {/* Breadcrumb Section */}
                <div className="mt-6 md:mt-14 flex space-x-2 font-bold text-gray-400 text-lg md:text-xl">
                    <Link href="/pages/Home">
                        <span>Home</span>
                    </Link>
                    <span>{'>'}</span>
                    <span className="text-gray-600">Shop</span>
                </div>

                {/* Intro Section */}
                <div className="mt-10 md:mt-14">
                    <div className="md:w-[70%] space-y-6 md:space-y-9">
                        <h1 className="font-bold text-3xl sm:text-5xl md:text-7xl">
                            We believe in sustainable decor. We’re passionate about life at home.
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600">
                            Our features timeless furniture, with natural fabrics, curved lines, plenty of mirrors and classic design, which can be incorporated into any decor project. The pieces enchant for their sobriety, to last for generations, faithful to the shapes of each period, with a touch of the present.
                        </p>
                    </div>
                </div>

                {/* Banner Section */}
                <div className="flex flex-col md:flex-row justify-between mt-12 md:mt-20 h-auto md:h-96 space-y-6 md:space-y-0">
                    {/* Left Image Section */}
                    <div className="flex-1 bg-slate-200 flex justify-center items-center">
                        <img
                            src="/images/Bannar/Paste image.jpg"
                            alt="Sign Up"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Content Section */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-center bg-white">
                        <div className="text-center md:text-left mx-auto md:mx-0 w-full sm:w-10/12 lg:w-8/12">
                            <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl">About Us</h1>
                            <p className="mt-4 text-gray-700 text-sm md:text-base">
                                3legant is a gift & decorations store based in HCMC, Vietnam. Est since 2019.
                            </p>
                            <p className="mt-1 md:mt-3">
                                Our customer service is always prepared to support you 24/7.
                            </p>
                            <div className="mt-6 flex justify-center md:justify-start items-center text-black font-bold cursor-pointer hover:underline">
                                <span>Show More</span>
                                <FaArrowRight className="ml-1 transform transition-transform duration-300 hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14">
                    <div className="flex justify-center">
                        <h1 className="text-5xl md:text-4xl font-bold text-center">Contact Us</h1>
                    </div>

                    <div className="flex flex-col md:flex-row mt-10 space-y-8 md:space-y-0 md:space-x-8 justify-center items-center w-full">
                        <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-3">
                            <FaRegAddressCard className="text-4xl text-black" />
                            <h2 className="text-xl font-semibold">ADDRESS</h2>
                            <p className="text-gray-600 text-sm md:text-base">234 Arish  Haram, Giza,  Egypt</p>
                            </div>
                        <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-3">
                            <CiPhone className="text-4xl text-black" />
                            <h1 className="text-xl font-semibold">Contact Us</h1>
                            <p className="text-gray-600 text-sm md:text-base">+20 15 538 59825</p>
                        </div>
                        <div className="text-center md:text-left flex flex-col items-center md:items-start space-y-3">
                            <MdOutlineEmail className="text-4xl text-black" />
                            <h2 className="text-xl font-semibold">Email</h2>
                            <p className="text-gray-600 text-sm md:text-base">mohamedabdelrauof112@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
