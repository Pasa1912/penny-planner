import { Hono } from "hono";

import { HTTPException } from "hono/http-exception";
import { getAuth } from "@hono/clerk-auth";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";

const app = new Hono().get("/", async (c) => {
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
});

export default app;
