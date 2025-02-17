import { products as productsList } from "@/data/products";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema/products";

async function main() {
  console.log("Seeding products");

  try {
    await db.insert(products).values(productsList);

    console.log("Products seeded successfully");
  } catch (error) {
    console.log("Error seeding products: ", error);
    process.exit(1);
  }
}

main();
