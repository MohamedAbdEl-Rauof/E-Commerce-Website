"use client";

import React, {createContext, useContext, useState} from "react";

interface ProductContextType {
    productId: string | null;
    setProductId: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({children}: { children: React.ReactNode }) => {
    const [productId, setProductIdState] = useState<string | null>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("productId");
        }
        return null;
    });

    const setProductId = (id: string) => {
        setProductIdState(id);
        if (typeof window !== "undefined") {
            localStorage.setItem("productId", id);
        }
    };

    return (
        <ProductContext.Provider value={{productId, setProductId}}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
