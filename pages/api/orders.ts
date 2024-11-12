import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

interface OrderItem {
  productId: ObjectId;
  quantity: number;
  subtotal: number;
  total: number;
}

interface Order {
  userId: ObjectId;
  contactInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: {
    method: string;
    cardNumber?: string;
    expirationDate?: string;
    cvc?: string;
  };
  items: OrderItem[];
  date: Date;
  orderCode: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db('e-commerce');

  if (req.method === 'POST') {
    const { userId, contactInfo, shippingAddress, paymentMethod, items } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!contactInfo || !shippingAddress || !paymentMethod || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const orderCollection = db.collection<Order>('orders');

      // Create a unique order code
      const orderCode = "ORDER-" + Math.floor(Math.random() * 1000000);

      // Format the order data to be inserted into the database
      const newOrder: Order = {
        userId: new ObjectId(userId),
        contactInfo,
        shippingAddress,
        paymentMethod,
        items: items.map((item: any) => ({
          productId: new ObjectId(item.productId),
          quantity: item.quantity,
          subtotal: item.subtotal,
          total: item.total,
        })),
        date: new Date(),
        orderCode,
      };

      // Insert the new order into the database
      await orderCollection.insertOne(newOrder);

      return res.status(201).json({ message: 'Order placed successfully', orderCode });
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ message: 'An error occurred while placing the order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};
