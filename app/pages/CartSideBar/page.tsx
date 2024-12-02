import React from 'react';
import { Box, Typography, List, ListItem, Button } from '@mui/material';
import { IoMdClose } from 'react-icons/io';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Link from 'next/link';

interface CartDrawerProps {
  cartItems: CartItem[];
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  calculateSubtotal: (items: CartItem[]) => number;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  cartItems,
  onClose,
  onIncrement,
  onDecrement,
  onDelete,
  onToggleFavorite,
  calculateSubtotal,
  onCheckout,
}) => {
  return (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      className="flex flex-col h-full"
    >
      <List className="flex-grow">
        <ListItem disablePadding className="block">
          <Typography component="div" className="pl-4 pt-3 text-2xl">
            Cart
          </Typography>
          {cartItems
            .filter((item) => item.quantity > 0 || item.isFavourite)
            .map((item) => (
              <Typography
                component="div"
                className="pl-4 pt-9 text-2xl"
                key={item.id}
              >
                <div className="relative flex items-center space-x-6 p-4 bg-gray-50 rounded-md shadow-md">
                  <div>
                    <img
                      src={item.image || "default_image_path"}
                      alt="img"
                      className="w-16 h-16 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                  <div className="flex flex-col flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-base font-semibold text-gray-800">
                        {item.name || "Product"}
                      </p>
                      <div className="absolute top-2 right-0 p-2 text-right text-base flex flex-col items-end">
                        <p className="text-gray-800 font-semibold">
                          ${item.price || "0.00"}
                        </p>
                        <IoMdClose
                          onClick={() => onDelete(item.id)}
                          className="text-lg text-gray-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                      <button
                        onClick={() => onDecrement(item.id)}
                        className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="text-base font-medium text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onIncrement(item.id)}
                        className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-3 right-20 p-2 text-right text-base flex flex-col items-end">
                    {item.isFavourite ? (
                      <FaHeart
                        className="text-red-500 cursor-pointer"
                        onClick={() => onToggleFavorite(item.id)}
                      />
                    ) : (
                      item.quantity > 0 && (
                        <FaRegHeart
                          className="text-gray-500 cursor-pointer"
                          onClick={() => onToggleFavorite(item.id)}
                        />
                      )
                    )}
                  </div>
                </div>
              </Typography>
            ))}
        </ListItem>
      </List>

      <div className="mt-auto p-4">
        <div className="p-3 flex justify-between">
          <Typography component="div" className="text-base">
            Subtotal
          </Typography>
          <Typography component="div" className="text-base">
            $ {calculateSubtotal(cartItems).toFixed(2)}
          </Typography>
        </div>

        <div className="p-3 flex justify-between">
          <Typography component="div" className="font-bold text-base">
            Total
          </Typography>
          <Typography component="div" className="text-base">
            $ {calculateSubtotal(cartItems).toFixed(2)}
          </Typography>
        </div>
        <Button
          sx={{ width: "90%", mx: "5%" }}
          variant="contained"
          className="bg-black hover:bg-gray-800"
          onClick={onCheckout}
        >
          Checkout
        </Button>
        <div className="text-center mt-3">
          <Link href="/pages/ViewCart">
            <button className="text-black text-xs font-semibold">
              <u className="text-black text-xs font-semibold text-center">
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