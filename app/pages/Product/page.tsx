"use client";
import React, { useEffect, useState } from "react";
import { useSelectedCategory } from "../.././pages/SelectedCategoryForProductContext/page";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

const Products = () => {
  const { categoryId } = useSelectedCategory();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?categoryId=${categoryId}`);
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (!categoryId) {
    return <p>No category selected. Please go back and select a category.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Products in Selected Category
      </h1>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="rounded-lg shadow-lg p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
