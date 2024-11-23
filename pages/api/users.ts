import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  if (req.method === "POST") {
    try {
      const { name, username, email, phone, password } = req.body;

      // Check if a user with the same email exists
      const existingEmail = await db.collection("users").findOne({ email });
      if (existingEmail) {
        return res
          .status(409)
          .json({ error: "A user with this email already exists" });
      }

      // Check if a user with the same phone number exists
      const existingPhone = await db.collection("users").findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({ error: "A user with this phone number already exists" });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // If no duplicates are found, proceed to create a new user
      const newUser = {
        name,
        username,
        email,
        phone,
        password: hashedPassword,
      };

      const result = await db.collection("users").insertOne(newUser);

      res
        .status(201)
        .json({ message: "User created", userId: result.insertedId });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error creating user" });
    }
  } else if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (id) {
        // Fetch user by ID
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(id as string) });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
      }

      // If no ID is provided, fetch all users
      const users = await db.collection("users").find({}).toArray();
      res.status(200).json(users);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error fetching users" });
    }
  } else {
    // If the request method is not POST or GET, return a 405 Method Not Allowed
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
