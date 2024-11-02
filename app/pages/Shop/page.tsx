"use client";
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/page";
import Link from "next/link";
import Image from "next/image";
import { IoFilter } from "react-icons/io5";
import { FaTh, FaThLarge, FaPause, FaEquals } from 'react-icons/fa';
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

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

interface FilterState {
    categoryId: string;
    priceRange: string;
}

interface PriceRange {
    label: string;
    range: string;
    min: number;
    max: number | null;
}

const priceRanges: PriceRange[] = [
    { label: "All Price", range: "all", min: 0, max: null },
    { label: "$0.00 - $99.99", range: "0-99.99", min: 0, max: 99.99 },
    { label: "$100.00 - $199.99", range: "100-199.99", min: 100, max: 199.99 },
    { label: "$200.00 - $299.99", range: "200-299.99", min: 200, max: 299.99 },
    { label: "$300.00 - $399.99", range: "300-399.99", min: 300, max: 399.99 },
    { label: "$400.00+", range: "400", min: 400, max: null }
];

const Shop = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all"); // Default to "All Rooms"
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
    const [loading, setLoading] = useState(false);
    const [favorite, setFavorite] = useState(
        new Array(products.length).fill(false)
    );
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all products for client-side filtering


    const initialFilterState: FilterState = {
        categoryId: "all",
        priceRange: "all"
    };

    const [filters, setFilters] = useState<FilterState>(initialFilterState);


    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories");
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setCategories([{ _id: "all", name: "All Rooms" }, ...data]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);


    // Fetch all products initially
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setAllProducts(data); // Store all products
                setProducts(data);
                setFavorite(new Array(data.length).fill(false));
            } catch (error) {
                console.error("Error fetching all products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);


    // Apply filters client-side
    const applyFilters = () => {
        let filteredProducts = [...allProducts];

        // Apply category filter
        if (filters.categoryId !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.categoryId === filters.categoryId
            );
        }

        // Apply price filter
        if (filters.priceRange !== 'all') {
            const selectedRange = priceRanges.find(range => range.range === filters.priceRange);
            if (selectedRange) {
                filteredProducts = filteredProducts.filter(product => {
                    const price = product.price;
                    if (selectedRange.max === null) {
                        return price >= selectedRange.min;
                    }
                    return price >= selectedRange.min && price <= selectedRange.max;
                });
            }
        }

        setProducts(filteredProducts);
    };

    // Apply filters whenever filter state changes
    useEffect(() => {
        applyFilters();
    }, [filters]);

    const handleFilterChange = (filterType: keyof FilterState, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters(initialFilterState);
    };

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

    const handleCategoryClick = async (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        setLoading(true);
        fetchFilteredProducts(categoryId, selectedPriceRange);

        try {
            if (categoryId === "all") {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setProducts(data);
            } else {
                const response = await fetch(`/api/products?categoryId=${categoryId}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredProducts = async (newFilters: FilterState) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();

            if (newFilters.categoryId !== "all") {
                queryParams.append("categoryId", newFilters.categoryId);
            }

            if (newFilters.priceRange !== "all") {
                queryParams.append("priceRange", newFilters.priceRange);
            }

            const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data);
            setFavorite(new Array(data.length).fill(false));

        } catch (error) {
            console.error("Error fetching filtered products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceRangeChange = async (range: string) => {
        setSelectedPriceRange(range);
        fetchFilteredProducts(selectedCategoryId, range);
    };




    useEffect(() => {
        fetchFilteredProducts(initialFilterState);
    }, []);

    const ActiveFilters = () => {
        const activeFilters = [];

        if (filters.categoryId !== 'all') {
            const category = categories.find(c => c._id === filters.categoryId);
            activeFilters.push({
                type: 'Category',
                value: category?.name || '',
                clear: () => handleFilterChange('categoryId', 'all')
            });
        }

        if (filters.priceRange !== 'all') {
            const price = priceRanges.find(p => p.range === filters.priceRange);
            activeFilters.push({
                type: 'Price',
                value: price?.label || '',
                clear: () => handleFilterChange('priceRange', 'all')
            });
        }

        if (activeFilters.length === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex items-center flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                        >
                            <span className="text-sm font-medium">{filter.type}: {filter.value}</span>
                            <button
                                onClick={filter.clear}
                                className="ml-2 text-gray-500 hover:text-black"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {activeFilters.length > 1 && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-black underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            </div>
        );
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

                <ActiveFilters />

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
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Category</h2>
                                {filters.categoryId !== 'all' && (
                                    <button
                                        onClick={() => handleFilterChange('categoryId', 'all')}
                                        className="text-sm text-gray-500 hover:text-black"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div>
                                {categories.map((cat) => (
                                    <div key={cat._id} className="mb-2">
                                        <label
                                            className={`cursor-pointer hover:text-black hover:underline ${filters.categoryId === cat._id ? 'font-bold text-black' : 'text-gray-600'
                                                }`}
                                            onClick={() => handleFilterChange('categoryId', cat._id)}
                                        >
                                            {cat.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Price</h2>
                                {filters.priceRange !== 'all' && (
                                    <button
                                        onClick={() => handleFilterChange('priceRange', 'all')}
                                        className="text-sm text-gray-500 hover:text-black"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            {priceRanges.map((price, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        id={price.range}
                                        name="price"
                                        className="mr-2"
                                        checked={filters.priceRange === price.range}
                                        onChange={() => handleFilterChange('priceRange', price.range)}
                                    />
                                    <label
                                        htmlFor={price.range}
                                        className={`text-gray-700 cursor-pointer ${filters.priceRange === price.range ? 'font-bold' : ''
                                            }`}
                                    >
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
                                {products.map((product, index) => (
                                    <div key={product._id} className="relative flex-shrink-0">
                                        <div className="group relative">
                                            {/* Product Image */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-52 object-cover rounded-md shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                                            />

                                            {/* Favorite Icon */}
                                            <div
                                                onClick={() => {
                                                    const newFavorites = [...favorite];
                                                    newFavorites[index] = !newFavorites[index];
                                                    setFavorite(newFavorites);
                                                }}
                                                className="absolute top-4 right-4 text-2xl text-gray-500 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            >
                                                {favorite[index] ? (
                                                    <FaHeart className="text-red-500" />
                                                ) : (
                                                    <FaRegHeart />
                                                )}
                                            </div>

                                            {/* Add to Cart Button */}
                                            <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-semibold">
                                                Add to Cart
                                            </button>

                                            {/* Labels */}
                                            <div className="absolute top-2 left-2">
                                                <p className="text-black bg-white px-2 py-1 rounded-md text-sm font-semibold">
                                                    New
                                                </p>
                                                <p className="text-white bg-green-500 px-2 mt-1 rounded-md text-sm font-semibold">
                                                    -50%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 mb-3">
                                            {/* Rating Section */}
                                            <Box sx={{ "& > legend": { mt: 2 } }}>
                                                <Rating
                                                    name="no-value"
                                                    value={null}
                                                    sx={{
                                                        "& .MuiRating-iconFilled": {
                                                            color: "black",
                                                        },
                                                    }}
                                                />
                                            </Box>

                                            {/* Product Name */}
                                            <p className="mt-2 font-semibold text-left">
                                                {product.name}
                                            </p>

                                            {/* Price and Discount Section */}
                                            <div className="flex gap-3 mt-2 text-left">
                                                <p className="font-bold">${product.price}</p>
                                                {product.PriceBeforeDiscount && (
                                                    <del className="text-gray-500">
                                                        ${product.PriceBeforeDiscount}
                                                    </del>
                                                )}
                                            </div>
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