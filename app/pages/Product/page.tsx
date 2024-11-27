// product/ page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useSelectedCategory } from "../.././pages/SelectedCategoryForProductContext/page";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";
import { useRouter } from "next/navigation";
import { Heart, Info } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  PriceBeforeDiscount?: number;
}

interface PriceRange {
  label: string;
  range: string;
  min: number;
  max: number | null;
}

const PRICE_RANGES: PriceRange[] = [
  { label: "All Price", range: "all", min: 0, max: null },
  { label: "$0.00 - $99.99", range: "0-99.99", min: 0, max: 99.99 },
  { label: "$100.00 - $199.99", range: "100-199.99", min: 100, max: 199.99 },
  { label: "$200.00 - $299.99", range: "200-299.99", min: 200, max: 299.99 },
  { label: "$300.00 - $399.99", range: "300-399.99", min: 300, max: 399.99 },
  { label: "$400.00+", range: "400", min: 400, max: null },
];

const Products = () => {
  const { categoryId } = useSelectedCategory();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?categoryId=${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    const selectedRange = PRICE_RANGES.find(
      (range) => range.range === priceRange,
    );

    if (!selectedRange) return;

    const filtered = products.filter((product) => {
      if (priceRange === "all") return true;
      if (selectedRange.max === null) {
        return product.price >= selectedRange.min;
      }
      return (
        product.price >= selectedRange.min && product.price <= selectedRange.max
      );
    });

    setFilteredProducts(filtered);
  }, [priceRange, products]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const navigateToProduct = (productId: string) => {
    router.push("/pages/ProductDetails");
  };

  if (!categoryId) {
    return <p>No category selected. Please go back and select a category.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Price</h2>
                {priceRange !== "all" && (
                  <button
                    onClick={() => setPriceRange("all")}
                    className="text-sm text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>
              {PRICE_RANGES.map((price) => (
                <div key={price.range} className="flex items-center mb-2">
                  <input
                    type="radio"
                    id={price.range}
                    name="price"
                    className="mr-2"
                    checked={priceRange === price.range}
                    onChange={() => setPriceRange(price.range)}
                  />
                  <label
                    htmlFor={price.range}
                    className={`text-gray-700 cursor-pointer ${
                      priceRange === price.range ? "font-bold" : ""
                    }`}
                  >
                    {price.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="relative group">
                    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 space-x-2">
                        <button
                          onClick={() => toggleFavorite(product._id)}
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites[product._id]
                                ? "fill-current text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => navigateToProduct(product._id)}
                          className="p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Info className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      {product.PriceBeforeDiscount && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                          -50%
                        </span>
                      )}
                      <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                        Add to Cart
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="flex gap-3">
                        <span className="font-bold">${product.price}</span>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
