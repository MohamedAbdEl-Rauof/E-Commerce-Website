"use client";
import React from 'react';
import { Box, Typography, List, ListItem, Button } from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartSideBar';

const CartDrawer = () => {
  const router = useRouter();
  const {
    cartItems,
    closeCart,
    incrementItem,
    decrementItem,
    deleteItem,
    toggleFavorite,
    calculateSubtotal,
  } = useCart();

  const handleCheckout = () => {
    router.push('/Signin');
  };

  return (
    <Box
      sx={{
        width: {
          xs: '100%',
          sm: '350px',
        },
        maxWidth: '350px'
      }}
      role="presentation"
      className="flex flex-col h-full"
    >
      <List className="flex-grow">
        <ListItem disablePadding className="block">
          <div className="flex justify-between items-center pl-4 pt-3">
            <Typography component="div" className="text-2xl">
              Cart
            </Typography>
            <IoMdClose
              onClick={closeCart}
              className="text-2xl text-gray-600 cursor-pointer mr-4"
            />
          </div>
          {cartItems
            .filter((item) => item.quantity > 0 || item.isFavourite)
            .map((item) => (
              <Typography
                component="div"
                className="pl-4 pt-6 text-2xl"
                key={item.id}
              >
                <div className="relative flex items-center space-x-4 p-3 bg-gray-50 rounded-md shadow-md mx-2">
                  <div>
                    <img
                      src={item.image || "default_image_path"}
                      alt="img"
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col flex-1 space-y-1 sm:space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm sm:text-base font-semibold text-gray-800">
                        {item.name || "Product"}
                      </p>
                      <div className="absolute top-2 right-0 p-2 text-right flex flex-col items-end">
                        <p className="text-sm sm:text-base text-gray-800 font-semibold">
                          ${item.price || "0.00"}
                        </p>
                        <IoMdClose
                          onClick={() => deleteItem(item.id)}
                          className="text-lg text-gray-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="text-base sm:text-lg font-bold text-gray-700 px-2 sm:px-3 py-1 hover:bg-gray-200 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="text-sm sm:text-base font-medium text-gray-800 px-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="text-base sm:text-lg font-bold text-gray-700 px-2 sm:px-3 py-1 hover:bg-gray-200 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-3 right-16 p-2 text-right flex flex-col items-end">
                    {item.isFavourite ? (
                      <FaHeart
                        className="text-red-500 cursor-pointer text-sm sm:text-base"
                        onClick={() => toggleFavorite(item.id)}
                      />
                    ) : (
                      item.quantity > 0 && (
                        <FaRegHeart
                          className="text-gray-500 cursor-pointer text-sm sm:text-base"
                          onClick={() => toggleFavorite(item.id)}
                        />
                      )
                    )}
                  </div>
                </div>
              </Typography>
            ))}
        </ListItem>
      </List>

      <div className="mt-auto p-3 sm:p-4">
        <div className="p-2 sm:p-3 flex justify-between">
          <Typography component="div" className="text-sm sm:text-base">
            Subtotal
          </Typography>
          <Typography component="div" className="text-sm sm:text-base">
            $ {calculateSubtotal().toFixed(2)}
          </Typography>
        </div>

        <div className="p-2 sm:p-3 flex justify-between">
          <Typography component="div" className="font-bold text-sm sm:text-base">
            Total
          </Typography>
          <Typography component="div" className="text-sm sm:text-base">
            $ {calculateSubtotal().toFixed(2)}
          </Typography>
        </div>
        <Button
          sx={{
            width: "90%",
            mx: "5%",
            fontSize: {
              xs: '0.875rem',
              sm: '1rem'
            }
          }}
          variant="contained"
          className="bg-black hover:bg-gray-800"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
        <div className="text-center mt-3">
          <Link href="/pages/ViewCart">
            <button className="text-black text-xs sm:text-sm font-semibold">
              <u className="text-black text-xs sm:text-sm font-semibold text-center">
                View Cart
              </u>
            </button>
          </Link>
        </div>
      </div>
    </Box>
  );
};

export default CartDrawer;