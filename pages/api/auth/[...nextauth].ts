import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db("e-commerce");
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.email === "admin@gmail.com" ? "admin" : "user",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(user); // Log the user object to check its contents
        token.role = user.role; // Ensure role is added
        token.id = user.id; // Add user ID to the token
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback:", token); // Log the token

      if (session?.user) {
        // Check if the token contains role and id
        if (token?.role) {
          session.user.role = token.role; // Assign role from token
        }
        if (token?.id) {
          session.user.id = token.id; // Assign ID from token
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/Signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
