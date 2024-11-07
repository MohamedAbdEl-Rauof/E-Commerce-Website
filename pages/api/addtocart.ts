import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

interface CartItem {
  productId: ObjectId;
  quantity: number;
  isFavourite: boolean;
}
interface Cart {
  userId: ObjectId;
  info: CartItem[];
}

interface Product {
  _id: ObjectId;
  name: string;
  price: number;
  image: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("e-commerce");

  if (req.method === "POST") {
    const { userId, productId, quantity, isFavourite } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized or invalid user ID" });
    }

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
      const cartCollection = db.collection<Cart>("cart");
      const productsCollection = db.collection<Product>("products");

      // Find the cart document for the user in side cart table
      const cart = await cartCollection.findOne({
        userId: new ObjectId(userId),
      });

      if (!cart) {
        // If the cart doesn't exist, create a new one
        const newCart = {
          userId: new ObjectId(userId),
          info: [
            {
              productId: new ObjectId(productId),
              quantity,
              isFavourite,
            },
          ],
        };

        // Insert the new cart document
        await cartCollection.insertOne(newCart);
        return res
          .status(200)
          .json({ message: "Product added to the cart successfully" });
      } else {
        // If the cart exists, check if the product already exists in the 'info' array
        const existingProductIndex = cart.info.findIndex(
          (item: CartItem) => item.productId.toString() === productId
        );

        if (existingProductIndex !== -1) {
          // If the product exists, update the quantity and favorite status
          await cartCollection.updateOne(
            { _id: cart._id },
            {
              $inc: {
                [`info.${existingProductIndex}.quantity`]: quantity, // Increment quantity
              },
              $set: {
                [`info.${existingProductIndex}.isFavourite`]: isFavourite, // Update isFavourite
              },
            }
          );
        } else {
          // If the product doesn't exist, add it to the 'info' array
          await cartCollection.updateOne(
            { _id: cart._id },
            {
              $push: {
                info: {
                  productId: new ObjectId(productId),
                  quantity,
                  isFavourite,
                } as CartItem,
              },
            }
          );
        }
      }

      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res
        .status(500)
        .json({ message: "An error occurred while adding to cart" });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    try {
      const cartCollection = db.collection<Cart>("cart");
      const productsCollection = db.collection<Product>("products");

      // Fetch the cart details for the user
      const cart = await cartCollection.findOne({
        userId: new ObjectId(userId as string),
      });

      if (!cart) {
        return res
          .status(404)
          .json({ message: "Cart not found for this user" });
      }

      // Prepare the data to return
      const cartItemsWithProductDetails = [];

      for (const item of cart.info) {
        // Fetch product details by productId
        const product = await productsCollection.findOne({
          _id: item.productId,
        });

        if (product) {
          // Merge the cart item with product details
          cartItemsWithProductDetails.push({
            productId: item.productId,
            quantity: item.quantity,
            isFavourite: item.isFavourite,
            productName: product.name,
            productPrice: product.price,  
            productImage: product.image,
          });
        }
      }

      // Respond with cart details and product information
      res.status(200).json(cartItemsWithProductDetails);
    } catch (error) {
      console.error("Error fetching cart details:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching cart details" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};
