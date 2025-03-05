import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { users } from "@/db/schema/users";

export const userRouter = createTRPCRouter({
  getData: baseProcedure.query(async ({ ctx }) => {
    const authUser = ctx.authUser;

    if (!authUser) {
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, authUser.id as string));

    return user;
  }),
  updateSettings: protectedProcedure
    .input(z.object({ name: z.string(), address: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { name, address } = input;

      const updatedUser = await db
        .update(users)
        .set({ name, address })
        .where(eq(users.id, userId as string))
        .returning();

      return updatedUser;
    }),
});
