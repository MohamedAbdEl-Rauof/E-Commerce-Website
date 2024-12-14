"use client";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import Swal from 'sweetalert2';
import {CartItem} from '../../types/cart';

interface CartContextType {
    cartItems: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>; // Add this line
    closeCart: () => void;
    incrementItem: (productId: string) => void;
    decrementItem: (productId: string) => void;
    deleteItem: (productId: string) => void;
    toggleFavorite: (productId: string) => void;
    calculateSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartSideBar: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [changes, setChanges] = useState(new Map());
    const {data: session} = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        if (userId) {
            fetchCartDetails();
        }
    }, [userId]);

    const fetchCartDetails = async () => {
        try {
            const response = await fetch(`/api/addtocart?userId=${userId}`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.cartItems)) {
                const formattedData = data.cartItems.map((item: any) => ({
                    id: item.productId.toString(),
                    image: item.productImage,
                    name: item.productName,
                    price: item.productPrice,
                    isFavourite: item.isFavourite,
                    quantity: item.quantity || 0,
                }));
                setCartItems(formattedData);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    const saveChanges = async () => {
        if (changes.size === 0 || !userId) return;
        try {
            for (const [productId, item] of changes.entries()) {
                if (item.quantity === 0 && !item.isFavourite) {
                    await fetch('/api/addtocart', {
                        method: 'DELETE',
                        body: JSON.stringify({userId, productId: item.id}),
                        headers: {'Content-Type': 'application/json'},
                    });
                } else {
                    await fetch('/api/addtocart', {
                        method: 'PUT',
                        body: JSON.stringify({
                            userId,
                            productId: item.id,
                            quantity: item.quantity,
                            isFavourite: item.isFavourite,
                        }),
                        headers: {'Content-Type': 'application/json'},
                    });
                }
            }
            setChanges(new Map());
        } catch (error) {
            console.error('Error saving cart changes:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            saveChanges();
        }, 5000);

        return () => clearInterval(interval);
    }, [changes]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const incrementItem = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId ? {...item, quantity: item.quantity + 1} : item
            )
        );
        updateChanges(productId, 1);
    };

    const decrementItem = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId && item.quantity > 1
                    ? {...item, quantity: item.quantity - 1}
                    : item
            )
        );
        updateChanges(productId, -1);
    };

    const updateChanges = (productId: string, quantityChange: number) => {
        setChanges((prevChanges) => {
            const newChanges = new Map(prevChanges);
            const item = cartItems.find((item) => item.id === productId);
            if (item) {
                newChanges.set(productId, {
                    ...item,
                    quantity: item.quantity + quantityChange,
                });
            }
            return newChanges;
        });
    };

    const deleteItem = async (productId: string) => {
        try {
            setCartItems((prevItems) =>
                prevItems.filter((item) => item.id !== productId)
            );

            if (userId) {
                await fetch('/api/addtocart', {
                    method: 'DELETE',
                    body: JSON.stringify({userId, productId}),
                    headers: {'Content-Type': 'application/json'},
                });

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Deleted Done',
                    showConfirmButton: false,
                    timer: 1000,
                });
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const toggleFavorite = (productId: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId
                    ? {...item, isFavourite: !item.isFavourite}
                    : item
            )
        );
        updateFavoriteChanges(productId);
    };

    const updateFavoriteChanges = (productId: string) => {
        setChanges((prevChanges) => {
            const newChanges = new Map(prevChanges);
            const item = cartItems.find((item) => item.id === productId);
            if (item) {
                const updatedItem = {...item, isFavourite: !item.isFavourite};
                newChanges.set(productId, updatedItem);
                if (updatedItem.quantity === 0 && !updatedItem.isFavourite) {
                    deleteItem(productId);
                    newChanges.delete(productId);
                }
            }
            return newChanges;
        });
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isOpen,
                setCartItems,
                openCart,
                closeCart,
                incrementItem,
                decrementItem,
                deleteItem,
                toggleFavorite,
                calculateSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};




