import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb"; // Import ObjectId for MongoDB

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle GET request to fetch products
  if (req.method === "GET") {
    try {
      const { categoryId } = req.query;

      // If categoryId is provided, fetch products by category
      let products;
      if (categoryId && typeof categoryId === 'string') {
        products = await db
          .collection("products")
          .find({ categoryId: new ObjectId(categoryId) }) // Ensure categoryId is queried as ObjectId
          .toArray();
      } else {
        // Otherwise, fetch all products
        products = await db.collection("products").find().toArray();
      }

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else {
    // Handle methods not allowed
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
