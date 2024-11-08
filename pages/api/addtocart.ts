import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

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
  const db = client.db('e-commerce');

  if (req.method === 'POST') {
    const { userId, productId, quantity, isFavourite } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Unauthorized or invalid user ID' });
    }

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
      const cartCollection = db.collection<Cart>('cart');
      const productsCollection = db.collection<Product>('products');

      const cart = await cartCollection.findOne({
        userId: new ObjectId(userId),
      });

      if (!cart) {
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

        await cartCollection.insertOne(newCart);
        return res.status(200).json({ message: 'Product added to the cart successfully' });
      } else {
        const existingProductIndex = cart.info.findIndex(
          (item: CartItem) => item.productId.toString() === productId
        );

        if (existingProductIndex !== -1) {
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

      res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'An error occurred while adding to cart' });
    }
  } else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || !ObjectId.isValid(userId as string)) {
      return res.status(400).json({ message: 'Invalid or missing userId' });
    }

    try {
      const cartCollection = db.collection<Cart>('cart');
      const productsCollection = db.collection<Product>('products');

      const cart = await cartCollection.findOne({
        userId: new ObjectId(userId as string),
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this user' });
      }

      const cartItemsWithProductDetails = await Promise.all(
        cart.info.map(async (item) => {
          const product = await productsCollection.findOne({ _id: item.productId });

          if (product) {
            return {
              productId: item.productId,
              quantity: item.quantity,
              isFavourite: item.isFavourite,
              productName: product.name,
              productPrice: product.price,
              productImage: product.image,
            };
          } else {
            return null;
          }
        })
      );

      const validCartItems = cartItemsWithProductDetails.filter((item) => item !== null);

      res.status(200).json({ cartItems: validCartItems });
    } catch (error) {
      console.error('Error fetching cart details:', error);
      res.status(500).json({ message: 'An error occurred while fetching cart details' });
    }
  } else if (req.method === 'PUT') {
    const { userId, productId, quantity, isFavourite } = req.body;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(401).json({ message: 'Unauthorized or invalid user ID' });
    }

    if (!productId || !ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Convert the productId to ObjectId type
    const productObjectId = new ObjectId(productId);

    try {
      const cartCollection = db.collection<Cart>('cart');

      // Find the cart document for the user
      const cart = await cartCollection.findOne({
        userId: new ObjectId(userId),
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this user' });
      }

      // Find the index of the existing product in the cart
      const existingProductIndex = cart.info.findIndex(
        (item: CartItem) => item.productId.equals(productObjectId)
      );

      if (existingProductIndex !== -1) {
        
        // If the product exists, update its quantity and favourite status
        await cartCollection.updateOne(
          { _id: cart._id },
          {
            $set: {
              [`info.${existingProductIndex}.quantity`]: quantity,
              [`info.${existingProductIndex}.isFavourite`]: isFavourite,
            },
          }
        );
        return res.status(200).json({ message: 'Cart updated successfully' });
      } else {
        // If product doesn't exist, create a new entry for the product in the cart
        await cartCollection.updateOne(
          { _id: cart._id },
          {
            $push: {
              info: {
                productId: productObjectId,
                quantity,
                isFavourite,
              },
            },
          }
        );
        return res.status(200).json({ message: 'Product added to cart' });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ message: 'An error occurred while updating cart' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};
