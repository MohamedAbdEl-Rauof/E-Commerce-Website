import clientPromise from "../../lib/mongodb"; 
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle POST request to create a new category
  if (req.method === "POST") {
    try {
      const { name, image } = req.body;

      const newCategory = { name, image };
      const result = await db.collection("categories").insertOne(newCategory);

      res
        .status(201)
        .json({
          message: "Category created",
          category: { id: result.insertedId, ...newCategory },
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating category" });
    }
  }
  // Handle GET request to fetch all categories
  else if (req.method === "GET") {
    try {
      const categories = await db.collection("categories").find().toArray(); 
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching categories" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
