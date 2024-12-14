"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {Box, Rating} from "@mui/material";
import {FaHeart} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {useProductContext} from "../../pages/context/ProductContext";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";
import Newsletter from "@/app/components/Newsletter/page";
import CountDown from "@/app/components/Countdown/page";
import Comment from "./component/comment"
import {useCart} from "../context/CartSideBar";

type Product = {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    PriceBeforeDiscount?: number;
    [key: string]: any;
};


// Loading Skeleton Component
const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-10 w-32 mb-8">
            <Skeleton height={40}/>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <Skeleton height={480} className="rounded-lg"/>
                <div className="space-y-6">
                    <Skeleton width={120} height={24}/>
                    <div>
                        <Skeleton height={36} className="mb-4"/>
                        <Skeleton count={3}/>
                    </div>
                    <div className="flex gap-4">
                        <Skeleton width={100} height={32}/>
                        <Skeleton width={100} height={32}/>
                    </div>
                    <Skeleton height={80}/>
                    <div className="flex gap-4">
                        <Skeleton width={100} height={40}/>
                        <Skeleton width={120} height={40}/>
                    </div>
                    <Skeleton height={48}/>
                </div>
            </div>
        </div>
        <div className="mt-16">
            <Skeleton height={200} className="rounded-lg"/>
        </div>
    </div>
);

// Error State Component
const ErrorState = ({message}: { message: string }) => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">{message}</p>
        </div>
    </div>
);

function ProductDetails() {
    const router = useRouter();
    const {productId} = useProductContext();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState("");
    const {
        cartItems,
        closeCart,
        incrementItem,
        decrementItem,
        deleteItem,
        toggleFavorite,
        calculateSubtotal,
    } = useCart();

    const cartItem = cartItems.find((item) => item.id === productId);

    useEffect(() => {
        if (!productId) {
            setError("No product ID provided");
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/SpecificProduct?_id=${productId}`);
                if (!response.ok) throw new Error("Failed to fetch product");
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleIncrement = () => {
        if (cartItem) {
            incrementItem(cartItem.id); // Increment the specific product in cart
        }
    };

    const handleDecrement = () => {
        if (cartItem) {
            decrementItem(cartItem.id); // Decrement the specific product in cart
        }
    };

    if (isLoading) {
        return <LoadingSkeleton/>;
    }

    if (error) {
        return <ErrorState message={error}/>;
    }

    if (!product) {
        return <ErrorState message="Product not found"/>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <LoadingSkeleton key="loading"/>
                ) : error ? (
                    <ErrorState key="error" message={error}/>
                ) : !product ? (
                    <ErrorState key="not-found" message="Product not found"/>
                ) : (
                    <motion.main
                        key="content"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
                    >
                        <motion.button
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            onClick={() => router.push("/pages/Product")}
                            className="flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2"/>
                            Back to Products
                        </motion.button>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                                {/* Product Gallery */}
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    className="space-y-4"
                                >
                                    <img
                                        src={product.image}  // Changed from `product.image` to `item.image`
                                        alt={product.name}  // Changed from `product.name` to `item.name`
                                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                                    />
                                </motion.div>

                                {/* Product Info */}
                                <div className="space-y-6">
                                    <div className="flex gap-3">
                                        <Box sx={{"& > legend": {mt: 2}}}>
                                            <Rating
                                                name="product-rating"
                                                value={4}
                                                sx={{
                                                    "& .MuiRating-iconFilled": {
                                                        color: "black",
                                                    },
                                                }}
                                            />
                                        </Box>
                                        <p className="font-bold">11 Reviews</p>
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                        <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
                                    </div>

                                    <div className="flex gap-5 items-center">
                                        <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                                        {product.PriceBeforeDiscount && (
                                            <del
                                                className="text-2xl text-gray-600">${product.PriceBeforeDiscount}</del>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">Offer Expires in:</p>
                                        <CountDown/>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-10">
                                            <div
                                                className="flex items-center border border-gray-300 rounded-md bg-white">
                                                <button
                                                    onClick={handleDecrement}
                                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span
                                                    className="px-4 py-2 border-x">{cartItem?.quantity || quantity}</span>
                                                <button
                                                    onClick={handleIncrement}
                                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <motion.button
                                                whileHover={{scale: 1.05}}
                                                whileTap={{scale: 0.95}}
                                                className={`ml-4 ${cartItem?.isFavourite ? "text-red-500" : "text-gray-500"}`}
                                                onClick={() => {
                                                    if (productId) toggleFavorite(productId);
                                                }}
                                            >
                                                <FaHeart/>
                                                <span>Wishlist</span>
                                            </motion.button>
                                        </div>

                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                                        >
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <Comment/>

                    </motion.main>
                )}
            </AnimatePresence>
            <div className="mt-16">
                <Newsletter/>
            </div>
            <Footer/>
        </div>
    );
}

export default ProductDetails;