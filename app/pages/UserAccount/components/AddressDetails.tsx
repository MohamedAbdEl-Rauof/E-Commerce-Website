"use client";

import { Card, Typography, Box, Button, Grid, Paper } from "@mui/material";
import { FaPlus } from "react-icons/fa";

const addresses = [
  {
    id: 1,
    type: "Billing Address",
    name: "Sofia Havertz",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
  },
  {
    id: 2,
    type: "Shipping Address",
    name: "Sofia Havertz",
    address: "456 Park Avenue",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    country: "United States",
  },
];

export default function AddressDetails() {
  return (
    <Card sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5">My Addresses</Typography>
        <Button startIcon={<FaPlus />} variant="contained">
          Add New Address
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address.id}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {address.type}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>{address.name}</Typography>
                <Typography>{address.address}</Typography>
                <Typography>
                  {address.city}, {address.state} {address.zip}
                </Typography>
                <Typography>{address.country}</Typography>
              </Box>
              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="outlined" size="small">
                  Edit
                </Button>
                <Button variant="outlined" color="error" size="small">
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
