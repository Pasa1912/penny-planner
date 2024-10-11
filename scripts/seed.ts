import { config } from "dotenv";
import { subDays, eachDayOfInterval, format } from "date-fns";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, accounts, transactions } from "@/db/schema";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const SEED_USER_ID = process.env.SAMPLE_CLERK_USER_ID!;

const SEED_CATEGORIES = [
  { id: "1", name: "Food", userId: SEED_USER_ID },
  { id: "2", name: "Rent", userId: SEED_USER_ID },
  { id: "3", name: "Utilities", userId: SEED_USER_ID },
  { id: "4", name: "Clothing", userId: SEED_USER_ID },
];

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
  switch (category.name) {
    case "Rent": {
      return Math.random() * 15000 + 10000;
    }
    case "Food": {
      return Math.random() * 1500 + 1000;
    }
    case "Utilities": {
      return Math.random() * 3000 + 500;
    }
    case "Clothing": {
      return Math.random() * 5000 + 2000;
    }
    case "Transportation":
    case "Health": {
      return Math.random() * 1000 + 1000;
    }
    default: {
      return Math.random() * 2500;
    }
  }
};

const SEED_ACCOUNTS = [
  { id: "1", name: "Checking", userId: SEED_USER_ID },
  { id: "2", name: "Savings", userId: SEED_USER_ID },
];

const defaultTo = new Date();
const defaultForm = subDays(defaultTo, 90);

const SEED_TRANSACTIONS: (typeof transactions.$inferInsert)[] = [];

const generateTransactionsForDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1;

  for (let i = 0; i < numTransactions; i++) {
    const category =
      SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];

    const isExpense = Math.random() > 0.6;

    const amount = generateRandomAmount(category);

    const formattedAmount = convertAmountToMilliUnits(
      isExpense ? -amount : amount
    );

    SEED_TRANSACTIONS.push({
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId:
        SEED_ACCOUNTS[Math.floor(Math.random() * SEED_ACCOUNTS.length)].id,
      categoryId: category.id,
      date: day,
      amount: formattedAmount,
      payee: "Merchant",
      notes: "Random Transaction",
    });
  }
};

const generateTransactions = () => {
  const days = eachDayOfInterval({ start: defaultForm, end: defaultTo });
  days.forEach((day) => generateTransactionsForDay(day));
};

generateTransactions();

const main = async () => {
  try {
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(categories).execute();

    await db.insert(accounts).values(SEED_ACCOUNTS).execute();
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  } catch (err) {
    console.error("Error during seed: ", err);
    process.exit(1);
  }
};

main();
