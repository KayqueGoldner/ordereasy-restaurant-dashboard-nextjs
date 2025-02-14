import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema/user";

export const createTRPCContext = cache(async () => {
  const session = await auth();

  return { authUserId: session?.user?.id };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;

    if (!ctx.authUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.authUserId, ctx.authUserId))
      .limit(1);

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: { ...ctx, user },
    });
  },
);
