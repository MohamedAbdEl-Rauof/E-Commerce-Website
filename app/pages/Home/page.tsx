"use client";
import React, { useEffect, useState } from "react";
import Header from "../../Header/page";
import { error } from "console";
import { FaArrowRight } from "react-icons/fa6";

interface Image {
  url:string,
  alt?:string,
}

interface Category {
  id:string,
  image:string,
  name:string,
}

const Home = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

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

  // to  change image auto
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

  return (
    <div className="w-[90%] mx-auto">
      <Header />
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

          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2 "
            aria-label="Previous Image"
          >
            &#10094;
          </button>
          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full p-2"
            aria-label="Next Image"
          >
            &#10095;
          </button>
        </div>
      </div>
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

      {/* Dynamic Banner Grid */}
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
    </div>
  );
};

export default Home;
