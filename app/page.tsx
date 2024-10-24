import { Inter } from "next/font/google";
import clientPromise from "../lib/mongodb"; // Assuming your MongoDB connection setup is correct

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  // Fetch data directly in the component
  const client = await clientPromise;
  const db = client.db('myDatabase');
  const data = await db.collection('myCollection').find({}).toArray();

  return (
    <div>
      <h1>MongoDB Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
