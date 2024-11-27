"use client";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  // In a real app, you would fetch the product details using the ID
  const product = {
    _id: id,
    name: "Premium Headphones",
    description:
      "High-quality wireless headphones with noise cancellation. Features include:\n\n- 40-hour battery life\n- Active noise cancellation\n- Premium sound quality\n- Comfortable fit\n- Bluetooth 5.0",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    specs: {
      brand: "AudioPro",
      model: "HP-2000",
      color: "Black",
      connectivity: "Wireless",
      batteryLife: "40 hours",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router(-1)}
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
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="border-t border-gray-200 pt-4">
                      <dt className="font-medium text-gray-500 capitalize">
                        {key}
                      </dt>
                      <dd className="mt-1 text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
