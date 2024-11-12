import React, { useState } from "react";
import Box from "@mui/material/Box";
import { ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CiCreditCard1 } from "react-icons/ci";
import { Button } from "flowbite-react";

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  isFavourite: boolean;
  quantity: number;
}

interface StepProps {
  cartItems: CartItem[];
}

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Step2: React.FC<StepProps> = ({ cartItems }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>("");

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className=" mx-auto mt-24 mb-14">
      {/* Main container with flex layout */}
      <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }}>

        {/* Left Column: Contact Information, Shipping Address, Payment Method */}
        <Box flex="1" display="flex" flexDirection="column" gap={4}>
          {/* Contact Information */}
          <Box
            sx={{
              padding: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Contact Information
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={3}>
                <TextField fullWidth id="first-name" label="First Name" variant="outlined" />
                <TextField fullWidth id="last-name" label="Last Name" variant="outlined" />
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField fullWidth id="phone-number" label="Phone Number" variant="outlined" />
                <TextField fullWidth id="email-address" label="Email Address" variant="outlined" />
              </Box>
            </Box>
          </Box>

          {/* Shipping Address */}
          <Box
            sx={{
              padding: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Shipping Address
            </Typography>
            <Box sx={{ mt: 4 }}>
              <TextField fullWidth id="street-address" label="Street Address" variant="outlined" />
              <TextField fullWidth id="country" label="Country" variant="outlined" sx={{ mt: 2 }} />
              <TextField fullWidth id="city" label="Town / City" variant="outlined" sx={{ mt: 2 }} />
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mt={2}>
                <TextField fullWidth id="state" label="State" variant="outlined" />
                <TextField fullWidth id="zip-code" label="Zip Code" variant="outlined" />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Checkbox {...label} />
                <Typography component="label" sx={{ ml: 1 }}>
                  Use a different billing address (optional)
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Payment Method */}
          <Box
            sx={{
              padding: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Payment Method
            </Typography>
            <Box sx={{ mt: 4, borderBottom: "1px solid #e0e0e0", pb: 1 }}>
              <ListItemButton
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "8px",
                  "&:hover": { borderColor: "#b0b0b0" },
                }}
                onClick={() => handleSelect("credit-card")}
              >
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  checked={selectedOption === "credit-card"}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <ListItemText primary="Pay By Card Credit" />
                  <CiCreditCard1 style={{ fontSize: 24 }} />
                </Box>
              </ListItemButton>
              <ListItemButton
                className="mt-7"
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "8px",
                  "&:hover": { borderColor: "#b0b0b0" },
                }}
                onClick={() => handleSelect("paypal")}
              >
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  checked={selectedOption === "paypal"}
                />
                <ListItemText primary="Paypal" />
              </ListItemButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField fullWidth id="card-number" label="Card Number" variant="outlined" />
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mt={2}>
                <TextField fullWidth id="expiration-date" label="Expiration Date" variant="outlined" />
                <TextField fullWidth id="cvc" label="CVC" variant="outlined" />
              </Box>
            </Box>
          </Box>
          <Button className="w-full bg-black text-white hover:bg-gray-800">
            Place Order
          </Button>
        </Box>

        {/* Right Column: Cart */}
        <Box flex="1" maxWidth={600}>
          <Box
            sx={{
              padding: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          >
            <Typography component="div" className="text-2xl font-bold mb-4">
              Order Summary
            </Typography>
            {/* Cart Items */}
            <Box className="relative flex items-center space-x-6 p-4 bg-gray-50 rounded-md shadow-md">
              <img
                src="default_image_path"
                alt="img"
                className="w-16 h-16 object-cover rounded-md border border-gray-300"
              />
              <Box className="flex flex-col flex-1 space-y-2">
                <Typography variant="body1" className="text-base font-semibold text-gray-800">
                  Product Name
                </Typography>
                <Box className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                  <button className="text-lg font-bold text-gray-700 px-3 py-1 rounded-l-md">-</button>
                  <span className="text-base font-medium text-gray-800">1</span>
                  <button className="text-lg font-bold text-gray-700 px-3 py-1 rounded-r-md">+</button>
                </Box>
              </Box>
              <Typography variant="body2" className="absolute top-2 right-0 text-right text-base font-semibold text-gray-800">
                $0.00
              </Typography>
            </Box>

            {/* Footer */}
            <Box mt={4} px={2}>
              <Box className="p-3 flex justify-between">
                <Typography className="text-base">Shipping</Typography>
                <Typography className="text-base">Free</Typography>
              </Box>
              <Box className="p-3 flex justify-between">
                <Typography className="text-base">Subtotal</Typography>
                <Typography className="text-base">$0.00</Typography>
              </Box>
              <Box className="p-3 flex justify-between font-bold text-base">
                <Typography className="font-bold text-xl">Total</Typography>
                <Typography className="font-bold text-xl">$0.00</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Step2;
