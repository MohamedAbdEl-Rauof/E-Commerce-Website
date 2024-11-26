"use client";

import React, { createContext, useContext, useState } from "react";

interface SelectedCategoryContextType {
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
}

const SelectedCategoryContext = createContext<SelectedCategoryContextType>({
  categoryId: null,
  setCategoryId: () => {},
});

// Provider component to wrap around your app or components
export const SelectedCategoryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [categoryId, setCategoryId] = useState<string | null>(null);

  return (
    <SelectedCategoryContext.Provider value={{ categoryId, setCategoryId }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};

// Custom hook to use the selected category context
export const useSelectedCategory = () => useContext(SelectedCategoryContext);
