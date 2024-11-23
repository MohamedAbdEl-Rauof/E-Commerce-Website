"use client";

import {
  Card,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Rating,
} from "@mui/material";
import { FaShoppingCart } from "react-icons/fa";

const wishlistItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$199.99",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$299.99",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Camera Lens",
    price: "$599.99",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=300&h=300&fit=crop",
  },
];

export default function WishlistItems() {
  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        My Wishlist
      </Typography>

      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {item.price}
                </Typography>
                <Rating value={item.rating} precision={0.5} readOnly />
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaShoppingCart />}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ minWidth: "auto" }}
                  >
                    ×
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
