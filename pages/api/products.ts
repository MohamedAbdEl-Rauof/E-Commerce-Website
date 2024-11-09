import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle GET request to fetch products
  if (req.method === "GET") {
    try {
      const { categoryId, priceRange } = req.query;

      // Create a new product object
      const newProduct = {
        name,
        description,
        price,
        image,
        categoryId,
        createdAt: new Date(),
        PriceBeforeDiscount
      };
      
      const result = await db.collection("products").insertOne(newProduct); 

      res.status(201).json({ message: "Product created", product: { id: result.insertedId, ...newProduct } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating product" });
    }
  }
  // Handle GET request to fetch all products
  else if (req.method === "GET") {
    try {
      const products = await db.collection("products").find().toArray(); 
      // Construct the filter query
      const filter: any = {};

      // If categoryId is provided, add to filter
      if (categoryId && typeof categoryId === 'string') {
        filter.categoryId = new ObjectId(categoryId);
      }

      // If priceRange is provided, parse and add to filter
      if (priceRange && typeof priceRange === 'string' && priceRange !== "all") {
        const [min, max] = priceRange.split("-");

        // Add the price filter based on the range
        if (max) {
          filter.price = { $gte: parseFloat(min), $lte: parseFloat(max) };
        } else {
          // This case is for the "$400+" range
          filter.price = { $gte: parseFloat(min) };
        }
      }

      // Fetch products based on the constructed filter
      const products = await db.collection("products").find(filter).toArray();

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
