import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure the MongoDB client is connected
  const client = await clientPromise;
  const db = client.db("e-commerce");

  // Handle only POST requests
  if (req.method === "POST") {
    try {
      // Extract user data from the request body
      const { name, username, email, phone, password } = req.body;

      // Create a new user object
      const newUser = {
        name,
        username,
        email,
        phone,
        password, 
      };

      // Insert the new user into the "users" collection
      const result = await db.collection("users").insertOne(newUser);

      // Send a success response with the new user's ID
      res.status(201).json({ message: "User created", userId: result.insertedId });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
