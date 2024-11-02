"use client";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/page";
import Link from "next/link";
import Image from "next/image";
import { IoFilter } from "react-icons/io5";
import { FaTh, FaThLarge, FaPause, FaEquals } from 'react-icons/fa';

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    image: string;
    price: number;
    categoryId: string;
    PriceBeforeDiscount?: string;
}

const Shop = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products when category is selected
    useEffect(() => {
        // In your Shop component's fetchProducts function:
        const fetchProducts = async () => {
            if (!selectedCategoryId) return;

            setLoading(true);
            try {
                const response = await fetch(`/api/products?categoryId=${selectedCategoryId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                // Optionally show error to user via toast/alert
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategoryId]);

    // Array of sort icons and labels
    const sortIcons = [
        { icon: FaTh, label: "Grid View" },
        { icon: FaThLarge, label: "Large Grid View" },
        { icon: FaPause, label: "Split View" },
        { icon: FaEquals, label: "List View" }
    ];

    // Handle category click
    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
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
                            Let's design the place you always imagined.
                        </p>
                    </div>
                </div>

                {/* Filters and Products Section */}
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
                                {categories.map((cat) => (
                                    <div key={cat._id} className="mb-2">
                                        <label
                                            className={`cursor-pointer hover:text-black hover:underline ${selectedCategoryId === cat._id ? 'font-bold text-black' : 'text-gray-600'
                                                }`}
                                            onClick={() => handleCategoryClick(cat._id)}
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

                    {/* Products Section */}
                    <div className="w-3/4">
                        {/* Sort Controls */}
                        <div className="flex justify-end items-center space-x-4 mb-6">
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

                        {/* Products Grid */}
                        {loading ? (
                            <div className="text-center py-10">Loading products...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                        <div className="relative h-48">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-lg font-bold">${product.price}</span>
                                            {product.PriceBeforeDiscount && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ${product.PriceBeforeDiscount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Products Message */}
                        {!loading && products.length === 0 && selectedCategoryId && (
                            <div className="text-center py-10 text-gray-500">
                                No products found for this category
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;