<<<<<<< Updated upstream:app/pages/CartContext/page.tsx
// pages/CartContext/page.tsx
=======
>>>>>>> Stashed changes:app/pages/CartContext/CartContextProvider.tsx
"use client";
import React, {createContext, useContext, useState, ReactNode} from "react";

interface Product {
    id: string;
    image: string;
    name: string;
    price: number;
    isFavourite: boolean;
    quantity: number;
}

interface CartContextType {
    cartItems: Product[];
    setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    return (
        <CartContext.Provider value={{cartItems, setCartItems}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    if (context.cartItems) {
        console.log("data ya Raouuuuuuuuuuuuuuuuuuuuuuuuuuf", context.cartItems);
    }
    return context;
};
