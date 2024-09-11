import { v4 } from "uuid";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";

const app = new Hono()
  .get("/", async (c) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized user" }, 401),
      });
    }

    const data = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts);
    return c.json({ accounts: data });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized user" }, 401),
        });
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: v4(),
          userId: auth.userId,
          ...values,
        })
        .returning();

      return c.json({ data });
    }
  );

export default app;
