import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  plaidId: text("plaidId"),
  name: varchar("name", { length: 256 }).notNull(),
  userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);
