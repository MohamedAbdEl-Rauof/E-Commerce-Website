import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { IoCloseOutline } from "react-icons/io5";

function createData(
  imageUrl: string,
  name: string,
  quantity: string,
  price: string,
  subtotal: string,
  remove: string
) {
  return { imageUrl, name, remove, quantity, price, subtotal };
}

const label = { inputProps: { "aria-label": "check circle" } };

const rows = [
  {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
    name: "Product 1",
    remove: "Remove",
    quantity: 2,
    price: "$19.00",
    subtotal: "$38.00",
  },
  {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
    name: "Product 2",
    remove: "Remove",
    quantity: 1,
    price: "$19.00",
    subtotal: "$19.00",
  },
  {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-C_UAhXq9GfuGO452EEzfbKnh1viQB9EDBQ&s",
    name: "Product 3",
    remove: "Remove",
    quantity: 5,
    price: "$19.00",
    subtotal: "$95.00",
  },
];

const Step1 = () => {
  const [selectedShipping, setSelectedShipping] = useState<number | null>(1);

  const handleSelectShipping = (optionId: number) => {
    setSelectedShipping(optionId);
  };

  return (
    <div className="mt-10 mb-14 flex justify-between w-auto mx-auto">
      {/* Table Section */}
      <Box sx={{ flex: 1, marginRight: 4 }}>
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", padding: "16px" }}>
                  Product
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ fontWeight: "bold", padding: "16px" }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", padding: "16px" }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", padding: "16px" }}
                >
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ padding: "16px" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={row.imageUrl}
                        alt={row.name}
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 16,
                          borderRadius: "5px",
                        }}
                      />
                      <div>
                        <div className="font-semibold">{row.name}</div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            marginTop: 1,
                          }}
                        >
                          <IoCloseOutline
                            style={{
                              cursor: "pointer",
                              marginLeft: 8,
                            }}
                            onClick={() => alert("Remove item")}
                          />
                          <span>{row.remove}</span>
                        </Box>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ padding: "16px" }}>
                    <div className="flex items-center justify-center border border-gray-300 rounded-md bg-white w-20">
                      <button className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-l-md">
                        -
                      </button>
                      <span className="text-base font-medium text-gray-800">
                        {row.quantity}
                      </span>
                      <button className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-r-md">
                        +
                      </button>
                    </div>
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "16px" }}>
                    {row.price}
                  </TableCell>
                  <TableCell align="right" sx={{ padding: "16px" }}>
                    {row.subtotal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Cart Summary Section */}
      <Box
        sx={{
          width: 400,
          padding: 2,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
        >
          Cart Summary
        </Typography>

        {/* Shipping Options */}
        <Box sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, mb: 1 }}>
          <ListItemButton onClick={() => handleSelectShipping(1)}>
            <Checkbox
              {...label}
              checked={selectedShipping === 1}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <ListItemText primary="Free Shipping" />
              <ListItemText primary="$0.00" sx={{ textAlign: "right" }} />
            </Box>
          </ListItemButton>
        </Box>

        <Box sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, mb: 1 }}>
          <ListItemButton onClick={() => handleSelectShipping(2)}>
            <Checkbox
              {...label}
              checked={selectedShipping === 2}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <ListItemText primary="Express Shipping" />
              <ListItemText primary="+ $15.00" sx={{ textAlign: "right" }} />
            </Box>
          </ListItemButton>
        </Box>

        <Box sx={{ borderBottom: "1px solid #e0e0e0", pb: 1, mb: 1 }}>
          <ListItemButton onClick={() => handleSelectShipping(3)}>
            <Checkbox
              {...label}
              checked={selectedShipping === 3}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <ListItemText primary="Pickup" />
              <ListItemText primary="- $21.00" sx={{ textAlign: "right" }} />
            </Box>
          </ListItemButton>
        </Box>

        {/* Summary */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="subtitle1">Subtotal</Typography>
          <Typography variant="subtitle1">$123.00</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            mt: 1,
          }}
        >
          <Typography variant="h6">Total</Typography>
          <Typography variant="h6">$123.00</Typography>
        </Box>

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
          Checkout
        </Button>
      </Box>
    </div>
  );
};

export default Step1;
