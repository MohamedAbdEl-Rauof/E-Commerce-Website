import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  if (req.method === "POST") {
    const { userId, productId, quantity } = req.body;

    // Validate the user and product IDs
    if (!userId || !ObjectId.isValid(userId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized or invalid user ID" });
    }

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
      const cartItemsCollection = db.collection("cartItems");

      // Check if the product is already in the user's cart
      const existingCartItem = await cartItemsCollection.findOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
      });

      if (existingCartItem) {
        // Update the quantity if the product is already in the cart
        await cartItemsCollection.updateOne(
          { _id: existingCartItem._id },
          { $inc: { quantity: quantity } }
        );
      } else {
        // Insert a new item if it's not in the cart
        await cartItemsCollection.insertOne({
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
          quantity,
        });
      }

      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res
        .status(500)
        .json({ message: "An error occurred while adding to cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};
