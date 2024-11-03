// pages/api/auth/signin.ts
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await db.collection("users").findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Respond based on user role
      if (user.email === "admin@gmail.com") {
        return res.status(200).json({ message: "Admin login successful" });
      }

      return res.status(200).json({ message: "User login successful" });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error signing in" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
