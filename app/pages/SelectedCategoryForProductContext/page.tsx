"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context type
interface SelectedCategoryContextType {
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
}

// Create the context with a default value
const SelectedCategoryContext = createContext<SelectedCategoryContextType>({
  categoryId: null,
  setCategoryId: () => {},
});

// Provider component to wrap around your app or components
export const SelectedCategoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Initialize state from localStorage if available
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the categoryId from localStorage on component mount
    const storedCategoryId = localStorage.getItem("categoryId");
    if (storedCategoryId) {
      setCategoryId(storedCategoryId);
    }
  }, []);

  const updateCategoryId = (id: string | null) => {
    setCategoryId(id);
    // Save to localStorage whenever the categoryId changes
    if (id === null) {
      localStorage.removeItem("categoryId");
    } else {
      localStorage.setItem("categoryId", id);
    }
  };

  return (
    <SelectedCategoryContext.Provider
      value={{ categoryId, setCategoryId: updateCategoryId }}
    >
      {children}
    </SelectedCategoryContext.Provider>
  );
};

// Custom hook to use the selected category context
export const useSelectedCategory = () => useContext(SelectedCategoryContext);
