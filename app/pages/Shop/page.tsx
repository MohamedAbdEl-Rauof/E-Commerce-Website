"use client";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/page";
import Link from "next/link";
import Image from "next/image";
import { IoFilter } from "react-icons/io5";
import { FaTh, FaThLarge, FaPause, FaEquals } from 'react-icons/fa';

interface Category {
    id: string;
    name: string;
}

const Shop = () => {
    const [category, setCategory] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // State for selected category ID

    // Fetch categories from API
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCategory(data);
                console.log("Fetched Categories:", data);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        fetchCategory();
    }, []);

    // Array of sort icons and labels for better structure and accessibility
    const sortIcons = [
        { icon: FaTh, label: "Grid View" },
        { icon: FaThLarge, label: "Large Grid View" },
        { icon: FaPause, label: "Split View" },
        { icon: FaEquals, label: "List View" }
    ];

    // Handle category click
    const handleCategoryClick = (categoryId: string) => {
        console.log("Clicked category ID:", categoryId); // Log the correct category ID
        setSelectedCategoryId(categoryId); // Update the state with the selected category ID
    };



    return (
        <div>
            <Header />
            <div className="w-[90%] mx-auto">
                {/* Banner Image */}
                <div className="mt-14 relative">
                    <Image
                        src="/images/Shop/Paste Image (1).jpg"
                        alt="Our Blog"
                        layout="responsive"
                        width={1000}
                        height={700}
                        className="w-full"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 bg-black bg-opacity-40">
                        <nav className="mt-6 md:mt-10 flex space-x-2 font-bold text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl">
                            <Link href="/">Home</Link>
                            <span>{">"}</span>
                            <span className="text-gray-600">Shop</span>
                        </nav>
                        <h1 className="mt-4 text-2xl sm:text-xl md:text-2xl lg:text-5xl font-bold text-center text-white">
                            Shop Page
                        </h1>
                        <p className="mt-4 text-center text-xs sm:text-sm md:text-base lg:text-base text-gray-300 sm:mt-1 md:mt-1">
                            Let’s design the place you always imagined.
                        </p>
                    </div>
                </div>

                {/* Filters and Sorting Section */}
                <div className="mt-10 flex space-x-8">
                    {/* Filter Section */}
                    <div className="w-1/4">
                        <div className="flex items-center space-x-2 text-lg font-semibold mb-6">
                            <IoFilter />
                            <span>Filter</span>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold mb-4">Category</h2>
                            <div>
                                {category.map((cat) => (
                                    <div key={cat._id} className="mb-2"> {/* Correct key */}
                                        <label
                                            htmlFor={cat._id} // Correct htmlFor
                                            className="text-gray-600 cursor-pointer hover:text-black hover:underline"
                                            onClick={() => handleCategoryClick(cat._id)} // Pass correct ID
                                        >
                                            {cat.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>




                        {/* Price Filter */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold mb-4">Price</h2>
                            {[
                                { label: "All Price", range: "all" },
                                { label: "$0.00 - $99.99", range: "0-99.99" },
                                { label: "$100.00 - $199.99", range: "100-199.99" },
                                { label: "$200.00 - $299.99", range: "200-299.99" },
                                { label: "$300.00 - $399.99", range: "300-399.99" },
                                { label: "$400.00+", range: "400+" },
                            ].map((price, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input type="checkbox" id={price.range} name="price" className="mr-2" />
                                    <label htmlFor={price.range} className="text-gray-700">
                                        {price.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sort and Display Section */}
                    <div className="w-3/4 flex flex-col items-end">
                        <div className="flex items-center space-x-4 mb-6">
                            <h2 className="text-lg font-bold">Sort by ↓</h2>
                            <div className="flex space-x-2">
                                {sortIcons.map(({ icon: Icon, label }, index) => (
                                    <button
                                        key={index}
                                        aria-label={label}
                                        className="text-gray-500 text-2xl hover:text-gray-800 focus:outline-none"
                                    >
                                        <Icon />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Display the selected category ID */}
                        {selectedCategoryId && (
                            <div className="mt-4 text-lg font-bold">
                                Selected Category ID: {selectedCategoryId}
                            </div>
                        )}

                        {/* Additional Content can be added here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
