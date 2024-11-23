"use client";

import {
  Card,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";

const orders = [
  {
    id: "#12345",
    date: "2024-01-15",
    status: "Delivered",
    total: "$299.99",
    items: 3,
  },
  {
    id: "#12346",
    date: "2024-01-10",
    status: "Processing",
    total: "$149.99",
    items: 2,
  },
  {
    id: "#12347",
    date: "2024-01-05",
    status: "Cancelled",
    total: "$89.99",
    items: 1,
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "success";
    case "processing":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

export default function OrdersList() {
  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        My Orders
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
