"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {Rating, Box, TextField, Button} from "@mui/material";
import {FaHeart} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {useProductContext} from "../../pages/context/ProductContext";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";
import Newsletter from "@/app/components/Newsletter/page";
import CountDown from "@/app/components/Countdown/page";
import type {Product} from "@/types/Product";

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

// Product Review Component
const ProductReview = ({name, image, review}: { name: string; image: string; review: string }) => (
    <div className="flex gap-4 p-4 border-b">
        <div className="flex-shrink-0">
            <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover"/>
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-lg">{name}</h3>
            <Box sx={{"& > legend": {mt: 2}}}>
                <Rating
                    name="read-only"
                    value={5}
                    readOnly
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "black",
                        },
                    }}
                />
            </Box>
            <p className="text-gray-600 mt-2">{review}</p>
            <div className="flex gap-4 mt-3">
                <button className="text-gray-600 hover:text-black transition-colors">Like</button>
                <button className="text-gray-600 hover:text-black transition-colors">Reply</button>
            </div>
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

    const handleAddToCart = () => {
        // Implement cart functionality
        console.log(`Adding ${quantity} of ${product?.name} to cart`);
    };

    const handleSubmitReview = () => {
        // Implement review submission
        console.log("Submitting review:", comment);
        setComment("");
    };

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
                                        src={product.image}
                                        alt={product.name}
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
                                            <del className="text-2xl text-gray-600">${product.PriceBeforeDiscount}</del>
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
                                                    onClick={() => handleQuantityChange(-1)}
                                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-2 border-x">{quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(1)}
                                                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <motion.button
                                                whileHover={{scale: 1.05}}
                                                whileTap={{scale: 0.95}}
                                                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                                            >
                                                <FaHeart/>
                                                <span>Wishlist</span>
                                            </motion.button>
                                        </div>

                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
                                            onClick={handleAddToCart}
                                            className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                                        >
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                            <div className="flex items-center gap-4 mb-8">
                                <Box sx={{"& > legend": {mt: 2}}}>
                                    <Rating
                                        name="overall-rating"
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

                            <div className="flex gap-4 mb-8">
                                <TextField
                                    fullWidth
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    label="Write your review"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitReview}
                                    sx={{
                                        bgcolor: 'black',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                                        },
                                    }}
                                >
                                    Publish
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
                                <ProductReview
                                    name="Sofia Harvetz"
                                    image="/images/Shop/Paste Image (1).jpg"
                                    review="I bought it 3 weeks ago and now come back just to say 'Awesome Product'. I really enjoy it. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupt et quas molestias excepturi sint non provident."
                                />
                            </div>
                        </div>

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