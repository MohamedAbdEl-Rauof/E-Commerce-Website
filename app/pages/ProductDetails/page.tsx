"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {useProductContext} from "../../pages/context/ProductContext";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";
import Loading from "@/app/components/Loading/page";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import CountDown from "@/app/components/Countdown/page";
import {FaHeart, FaRegHeart, FaArrowRight} from "react-icons/fa";
import {Button, TextField} from "@mui/material";
import Newsletter from "@/app/components/Newsletter/page";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    PriceBeforeDiscount?: number;
}

function ProductDetails() {
    const router = useRouter();
    const {productId} = useProductContext();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/SpecificProduct?_id=${productId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading/>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <Header/>
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => router.push("/pages/Product")}
                    className="flex items-center text-gray-600 hover:text-black mb-8"
                >
                    <ArrowLeft className="w-5 h-5 mr-2"/>
                    Back to Products
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-3">
                                {/* Rating Section */}
                                <Box sx={{"& > legend": {mt: 2}}}>
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
                                <p className="font-bold">11 Review</p>
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {product.name}
                                </h1>
                                <p className="whitespace-pre-line text-gray-600">
                                    {product.description}{" "}
                                </p>
                            </div>

                            <div className="flex gap-5 ">
                                <p className="text-2xl font-bold text-gray-900 ">
                                    ${product.price}
                                </p>
                                <del className="text-2xl text-gray-600">
                                    {product.PriceBeforeDiscount}
                                </del>
                            </div>

                            <div>
                                <p className="text-2xl font-bold text-gray-900 ">
                                    {" "}
                                    offer Expiress in:
                                </p>
                                <CountDown/>{" "}
                            </div>
                            <div>
                                <div className="flex gap-10">
                                    <div className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                                        <button
                                            // onClick={() => decrement(item.id)}
                                            className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-l-md"
                                        >
                                            -
                                        </button>
                                        <span className="text-base font-medium text-gray-800">
                      {/* {item.quantity} */} 1
                    </span>
                                        <button
                                            // onClick={() => increment(item.id)}
                                            className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-r-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex border-x-2">
                                        <FaHeart/>
                                        <p> Wishlist </p>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <h1>Reviews</h1>
                </div>
                <div>
                    <div>
                        <h1>Customer Reviews</h1>
                        <div className="flex gap-3">
                            {/* Rating Section */}
                            <Box sx={{"& > legend": {mt: 2}}}>
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
                            <p className="font-bold">11 Review</p>
                        </div>
                    </div>
                    <div className="flex">
                        <TextField id="outlined-basic" label="Comment" variant="outlined"/>
                        <Button variant="contained">Publish</Button>
                    </div>
                    <div>
                        <div>11 Reviews</div>
                        <div className="flex">
                            <div>
                                <img
                                    src="/images/Shop/Paste Image (1).jpg"
                                    alt=""
                                    width="10%"
                                    height="10%"
                                />
                            </div>
                            <div className="">
                                <h1>sofia harvetz</h1>
                                {/* Rating Section */}
                                <Box sx={{"& > legend": {mt: 2}}}>
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
                                <p>
                                    I bought it 3 weeks ago and now come back just to say “Awesome
                                    Product”. I really enjoy it. At vero eos et accusamus et iusto
                                    odio dignissimos ducimus qui blanditiis praesentium voluptatum
                                    deleniti atque corrupt et quas molestias excepturi sint non
                                    provident.
                                </p>
                                <div className="flex gap-3">
                                    <button>Like</button>
                                    <button>Reply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Newsletter/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ProductDetails;