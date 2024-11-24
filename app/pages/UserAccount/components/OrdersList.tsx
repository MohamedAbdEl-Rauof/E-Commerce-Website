"use client";

import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderCode: string;
  createdAt: string;
  items: OrderItem[];
  shoppingandTotal: {
    subTotal: string;
    Total: string;
    shippingType:string;

  };
  paymentMethod:{
    method:string;
  }
}

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
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const [orderData, setOrderData] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ordersAllAddress?userId=${userId}`);
        const data = await response.json();
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  return (
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          My Orders
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Code</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Shipping Type</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderCode}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                          label="Processing"
                          color={getStatusColor("processing")}
                          size="small"
                      />
                    </TableCell>
                    <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                    <TableCell>{order.shoppingandTotal.shippingType}</TableCell>
                    <TableCell>{formatCurrency(order.shoppingandTotal.Total)}</TableCell>
                    <TableCell>{order.paymentMethod.method}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
  );
}