"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ProductContextType {
  productId: string | null;
  setProductId: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Get the initial productId from localStorage, if available
  const [productId, setProductIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("productId");
    }
    return null;
  });

  // Update localStorage whenever the productId changes
  const setProductId = (id: string) => {
    setProductIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("productId", id);
    }
  };

  return (
    <ProductContext.Provider value={{ productId, setProductId }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
