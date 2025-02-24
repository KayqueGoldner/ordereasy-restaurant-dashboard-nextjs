import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { users } from "@/db/schema/users";
import { cart } from "@/db/schema/cart";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub, Google],
  session: {
    strategy: "database",
  },
  events: {
    async createUser({ user }) {
      if (!user) {
        console.log("no user logged");
      }

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id as string));

      if (!existingUser) {
        console.log("no user found");
      }

      if (!existingUser.cartId) {
        const [newCart] = await db.insert(cart).values({}).returning();

        if (newCart) {
          await db
            .update(users)
            .set({ cartId: newCart.id })
            .where(eq(users.id, existingUser.id));
        }
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id as string));

      return {
        ...session,
        user: {
          ...session.user,
          role: dbUser.role,
        },
      };
    },
  },
});
