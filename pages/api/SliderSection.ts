import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle POST request to add a new slider entry
  if (req.method === "POST") {
    try {
      const { images } = req.body;

      // Check if images is an array with at least one item
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "Images array is required" });
      }

      // Create a new slider document with an array of images
      const newSliderSection = { images };
      const result = await db
        .collection("slider-section")
        .insertOne(newSliderSection);

      res.status(201).json({
        message: "Slider section created",
        slider: { id: result.insertedId, ...newSliderSection },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating slider section" });
    }
  }
  // Handle GET request to fetch all slider sections
  else if (req.method === "GET") {
    try {
      const sliderSections = await db
        .collection("slider-section")
        .find()
        .toArray(); // Fetch all slider sections
      res.status(200).json(sliderSections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching slider sections" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
