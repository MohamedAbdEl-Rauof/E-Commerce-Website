import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = await clientPromise;
    const db = client.db("e-commerce");
    const collection = db.collection("products");

    if (req.method === "GET") {
      const { _id } = req.query;

      if (_id) {
        try {
          const objectId = new ObjectId(_id as string);
          const product = await collection.findOne({ _id: objectId });

          if (!product) {
            return res.status(404).json({ error: "Product not found" });
          }

          return res.status(200).json(product);
        } catch (error) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
      } else {
        // Fetch all products if no ID is specified
        const products = await collection.find({}).toArray();
        return res.status(200).json(products);
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
