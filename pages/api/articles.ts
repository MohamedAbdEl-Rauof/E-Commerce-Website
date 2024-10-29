import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  if (req.method === "GET") {
    try {
      const articles = await db.collection("articles").find().toArray();
      res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Error fetching articles" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
