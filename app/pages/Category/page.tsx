"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelectedCategory } from "../.././pages/SelectedCategoryForProductContext/page";
import Header from "../../components/Header/page";
import Footer from "../../components/Footer/page";

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setCategoryId(categoryId); // Store category ID in context
    router.push("/pages/Product");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Explore Our Categories
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(categories.length || 4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Category;
