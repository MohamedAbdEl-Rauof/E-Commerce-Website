"use client";
import React, { useEffect, useState } from "react";
import Header from "../../Header/page";
import { FaHeart, FaRegHeart, FaArrowRight } from "react-icons/fa";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

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
  createdAt:Date;
}

const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorite, setFavorite] = useState(
    new Array(products.length).fill(false)
  );

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
  const isDateWithinLastThreeDays = (dateString : Date) => {
    // Parse the ISO date string to a Date object
    const productDate = new Date(dateString);

    // Get current date and set time to midnight for consistent comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate date 3 days ago
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

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
        const recentProducts = data.filter((product:Product) =>
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

  return (
    <div className="w-[90%] mx-auto">
      <Header />

      {/* Slider Section */}
      <div className="mt-10 w-[90%] mx-auto">
        <div
          className="flex items-center justify-centeroverflow-hidden relative"
          style={{
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {images.length > 0 && (
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-sm"
              style={{
                objectFit: "cover",
              }}
            />
          )}

          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 "
            aria-label="Previous Image"
          >
            &#10094;
          </button>

          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2"
            aria-label="Next Image"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* Text Section */}
      <div className="mt-14 w-[90%] mx-auto flex md:flex-row justify-between">
        <div className="md:w-1/2">
          <h1 className="font-bold text-5xl">Simply Unique</h1>
          <h1 className="font-bold text-5xl">Simply Better</h1>
        </div>
        <div className="pt-8 md:mt-0 md:w-1/2 md:ml-4">
          <p>
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
        {categories.map((category) => (
          <div
            key={category.id}
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
              <u className="flex items-center mt-1 text-blue-400 cursor-pointer">
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
            <h1 className="text-4xl font-bold">New</h1>
            <h1 className="text-4xl font-bold">Arrivals</h1>
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

                      {/* Favorite Icon (Heart) */}
                      <div
                        onClick={() =>
                          setFavorite((prev) => {
                            const newFav = [...prev];
                            const index = products.findIndex(
                              (product) => product._id === item._id
                            );
                            newFav[index] = !newFav[index];
                            return newFav;
                          })
                        }
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
    </div>
  );
};

export default Home;
