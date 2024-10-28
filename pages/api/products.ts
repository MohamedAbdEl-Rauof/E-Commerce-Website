import clientPromise from "../../lib/mongodb"; 
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle POST request to create a new product
  if (req.method === "POST") {
    try {
      const { name, description, price, image, categoryId } = req.body;

      // Create a new product object
      const newProduct = {
        name,
        description,
        price,
        image,
        categoryId,
        createdAt: new Date(),
      };
      
      const result = await db.collection("products").insertOne(newProduct); // Save to the database

      res.status(201).json({ message: "Product created", product: { id: result.insertedId, ...newProduct } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating product" });
    }
  }
  // Handle GET request to fetch all products
  else if (req.method === "GET") {
    try {
      const products = await db.collection("products").find().toArray(); // Fetch all products
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
