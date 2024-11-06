"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/page";
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiCreditCard2 } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import Footer from "../../components/Footer/page";
import Newsletter from "../../components/Newsletter/page";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Image {
  url: string;
  alt?: string;
}

interface Category {
  id: string;
  image: string;
  name: string;
}

interface Product {
  _id: string;
  image: string;
  name: string;
  price: string;
  PriceBeforeDiscount: string;
  createdAt: Date;
}

interface Article {
  images: string;
  name: string;
}

interface AddToCart {
  userId: string;
  productId: string;
  quantity: number;
  isFavourite: boolean;
}

interface Favourite {
  userId: string;
  productId: string;
  isFavourite: boolean;
}

const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorite, setFavorite] = useState(
    new Array(products.length).fill(false)
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/SliderSection");
        const data = await response.json();
        setImages(data[0]?.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  // to  change image automatically
  useEffect(() => {
    if (images.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 9000);
      return () => clearInterval(intervalId);
    }
  }, [images]);

  const containerWidth = "100%";
  const containerHeight = "770px";

  // Function to go to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Fetch categories from the API
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

  // check if a date is within the last 3 days
  const isDateWithinLastThreeDays = (dateString: Date) => {
    // Parse the ISO date string to a Date object
    const productDate = new Date(dateString);

    // Get current date and set time to midnight for consistent comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate date 3 days ago
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 10);

    // Return true if the product date is between threeDaysAgo and today (inclusive)
    return productDate >= threeDaysAgo;
  };

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Filter to only show products from the last 3 days
        const recentProducts = data.filter((product: Product) =>
          isDateWithinLastThreeDays(product.createdAt)
        );
        setProducts(recentProducts);
        setFavorite(new Array(recentProducts.length).fill(false));
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, []);

  // fetch Articles from APi
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchArticle();
  }, []);

  // add to cart and favourite
  async function addToCart({
    productId,
    quantity,
    isFavourite,
    userId,
  }: AddToCart) {
    // Check if user is logged in
    if (!userId) {
      Swal.fire({
        title: "Please Log In",
        text: "You must be logged in to add products to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Log In Page",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/Signin");
        }
      });
      return;
    }

    const response = await fetch("/api/addtocart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity, isFavourite }),
    });

    const data = await response.json();

    // Handle different response statuses
    if (response.status === 401 && data.redirect) {
      Swal.fire({
        title: "Please Log In",
        text: data.message,
        icon: "warning",
        confirmButtonText: "Go to Login",
        timer: 1500,
      }).then(() => {
        window.location.href = data.redirect;
      });
    } else if (response.ok) {
      Swal.fire("Success", data.message, "success");
    } else {
      Swal.fire("Error", data.message || "Could not add to cart", "error");
    }
  }

  // Handle add to cart click
  const handleAddToCart = (
    productId: string,
    quantity: number,
    isFavourite: boolean
  ) => {
    if (session && session.user) {
      const userId = session.user.id; // Get user ID from session
      addToCart({ productId, quantity, isFavourite, userId }); // Call the function with userId
    } else {
      Swal.fire({
        title: "Please Log In",
        text: "You need to be logged in to add to the cart.",
        icon: "warning",
        confirmButtonText: "Go to Login",
      }).then(() => {
        router.push("/Signin");
      });
    }
  };

  console.log(session);

  return (
    <div>
      {/* Header Section*/}
      <Header />

      {/* Slider Section */}
      <div className="mt-10 w-[90%] mx-auto">
        <div
          className="relative overflow-hidden"
          style={{
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {images.length > 0 && (
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Previous button */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition duration-300"
            aria-label="Previous Image"
          >
            &#10094;
          </button>

          {/* Next button */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-200 transition duration-300"
            aria-label="Next Image"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-14 w-[90%] mx-auto flex md:flex-row justify-between">
        <div className="md:w-1/2">
          <h1 className="font-bold text-3xl">Simply Unique / Simply Better</h1>
          <p className="pt-5">
            <strong>3legant</strong> is a gift & decorations store based in
            HCMC, Vietnam. Established since 2019.
          </p>
        </div>
      </div>

      {/* Banner Grid Section */}
      <div
        className={`mt-14 mb-10 grid gap-4 w-[90%] mx-auto ${
          categories.length <= 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {categories.map((category, index) => (
          <div
            key={category.id || index}
            className="relative overflow-hidden rounded-md group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-60 object-cover transition-transform duration-300 transform group-hover:scale-105"
            />
            {/* Background overlay appears only on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Category name and link always visible */}
            <div className="absolute bottom-0 left-0 p-4">
              <h1 className="text-lg font-bold text-white">{category.name}</h1>
              <u className="flex items-center mt-1 text-black font-bold cursor-pointer shad">
                Show Now <FaArrowRight className="ml-1" />
              </u>
            </div>
          </div>
        ))}
      </div>

      {/* New Arrivals Section */}
      <div className="mt-14 w-[90%] mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">New Arrivals</h1>
            <h1 className="text-4xl font-bold"></h1>
          </div>
          <div>
            <u className="flex items-center text-black font-bold cursor-pointer hover:underline">
              More Products
              <FaArrowRight className="ml-1 transform transition-transform duration-300 hover:translate-x-1" />
            </u>
          </div>
        </div>
        <div className="mt-7 mb-36 flex justify-center">
          <div className="relative w-full overflow-x-auto scroll-container">
            <div className="flex gap-6 justify-start items-stretch">
              {products.length > 0 ? (
                products.map((item) => (
                  <div key={item._id} className="relative flex-shrink-0 w-64">
                    <div className="group relative">
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-52 object-cover rounded-md shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                      />

                      <div
                        onClick={() => {
                          const index = products.findIndex(
                            (product) => product._id === item._id
                          );
                          const newFav = [...favorite];
                          newFav[index] = !newFav[index];

                          setFavorite(newFav);

                          const isFavourite = newFav[index];
                          handleAddToCart(item._id, 0, isFavourite);
                        }}
                        className="absolute top-4 right-4 text-2xl text-gray-500 cursor-pointer opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        {favorite[
                          products.findIndex(
                            (product) => product._id === item._id
                          )
                        ] ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(item._id, 1, false)}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100 font-semibold"
                      >
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
                              color: "black", // Color for filled stars
                            },
                          }}
                        />
                      </Box>

                      {/* Product Name */}
                      <p className="mt-2 font-semibold text-left">
                        {item.name}
                      </p>

                      {/* Price and Discount Section */}
                      <div className="flex gap-3 mt-2 text-left">
                        <p className="font-bold">${item.price}</p>
                        {item.PriceBeforeDiscount && (
                          <del className="text-gray-500">
                            ${item.PriceBeforeDiscount}
                          </del>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-6 w-[90%] mx-auto">
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="flex flex-col items-center justify-center bg-[#F3F5F7] w-44 h-44 rounded-full p-4 text-center">
            <CiDeliveryTruck className="text-5xl text-gray-700 mb-2" />
            <h1 className="mt-2 font-bold text-base">Free Shipping</h1>
            <p className="text-sm text-gray-500">Order above $200</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#F3F5F7] w-44 h-44 rounded-full p-4 text-center">
            <CiCreditCard2 className="text-5xl text-gray-700 mb-2" />
            <h1 className="mt-2 font-bold text-base">Money-back</h1>
            <p className="text-sm text-gray-500">30 days guarantee</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#F3F5F7] w-44 h-44 rounded-full p-4 text-center">
            <CiLock className="text-5xl text-gray-700 mb-2" />
            <h1 className="mt-2 font-bold text-base">Secure Payments</h1>
            <p className="text-sm text-gray-500">Secured by Stripe</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#F3F5F7] w-44 h-44 rounded-full p-4 text-center">
            <CiPhone className="text-5xl text-gray-700 mb-2" />
            <h1 className="mt-2 font-bold text-base">24/7 Support</h1>
            <p className="text-sm text-gray-500">Phone and Email support</p>
          </div>
        </div>
      </div>

      {/* Banner section */}
      <div className="flex flex-col md:flex-row justify-between mt-20 h-auto md:h-96">
        {/* Left Image Section */}
        <div className="bg-slate-200 flex-1 flex justify-center items-center">
          <img
            src="/images/Bannar/Paste image.jpg"
            alt="Sign Up"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content Section */}
        <div className="flex-1 p-6 md:p-4 flex flex-col justify-center bg-gray-100">
          <div className="pl-9 text-center md:text-left mx-auto md:mx-0 md:w-10/12 lg:w-8/12">
            <p className="mt-6 text-blue-500 font-bold text-lg md:text-xl">
              SALE UP TO 35% OFF
            </p>
            <div className="mt-4 font-bold text-3xl md:text-4xl lg:text-5xl">
              <h1>HUNDREDS of</h1>
              <h1>New lower prices!</h1>
            </div>
            <p className="mt-6 text-gray-700 text-sm md:text-base">
              It’s more affordable than ever to give every room in your home a
              stylish makeover
            </p>
            <u className="mt-7 flex justify-center md:justify-start items-center text-black font-bold cursor-pointer hover:underline">
              <span>Show More</span>
              <FaArrowRight className="ml-1 transform transition-transform duration-300 hover:translate-x-1" />
            </u>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-14 w-[90%] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Article</h1>
          <u className="flex items-center text-black font-bold cursor-pointer hover:underline">
            More Article
            <FaArrowRight className="ml-1 transform transition-transform duration-300 hover:translate-x-1" />
          </u>
        </div>

        <div className="mt-10 flex flex-wrap gap-5 justify-center md:justify-start">
          {articles.slice(0, 3).map((article, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full md:w-[30%]"
            >
              <div className="w-full overflow-hidden rounded-lg">
                <img
                  src={article.images[0]}
                  alt={`Article ${index + 1}`}
                  className="w-full h-52 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h1 className="mt-4 text-center font-semibold">{article.name}</h1>
              <u className="mt-2 flex items-center text-black font-bold cursor-pointer hover:underline">
                <span>Read More</span>
                <FaArrowRight className="ml-1 transform transition-transform duration-300 hover:translate-x-1" />
              </u>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer Section */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
