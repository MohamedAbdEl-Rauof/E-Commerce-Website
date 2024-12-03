"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedCategory } from "../SelectedCategoryForProductContext/page";
import Header from "../../components/Header/page";
import Footer from "../../components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";

interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const Category = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setCategoryId } = useSelectedCategory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setCategoryId(categoryId);
    router.push("/pages/Product");
  };

  return (
    <div className="min-h-screen ">
      <Header />
      {/* Banner Section */}
      <div className="w-[90%] mx-auto">
        {isLoading ? (
          <div className="h-[400px] rounded-xl bg-gray-200 animate-pulse mb-8"></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-14 relative h-[400px] rounded-xl overflow-hidden"
          >
            <Image
              src="/images/Categories/main image.jpg"
              alt="Shop Banner"
              layout="fill"
              objectFit="cover"
              priority
              className="transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col items-center justify-center">
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-white mb-4"
              >
                <Link href="/" className="hover:text-gray-200 transition">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-300">Categories</span>
              </motion.nav>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4 text-center"
              >
                Categories Page
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-200 text-center max-w-2xl px-4"
              >
                Don&apos;t Waste Time, Shop Now
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Explore Our Categories
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className="aspect-w-16 aspect-h-9 relative h-64">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-white mb-2 transform transition-all duration-300 group-hover:translate-y-0">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Explore our {category.name.toLowerCase()} collection
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Category;
