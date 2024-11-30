"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProductContext } from "../../pages/context/ProductContext";
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";

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
  const { productId } = useProductContext();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Header />
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/pages/Product")}
          className="flex items-center text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${product.price}
                </p>
              </div>

              <div className="prose prose-sm">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="whitespace-pre-line text-gray-600">
                  {product.description}{" "}
                </p>
              </div>

              {product.PriceBeforeDiscount && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Before Discount</h3>
                  <p className="text-gray-600">{product.PriceBeforeDiscount}</p>
                </div>
              )}

              <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetails;