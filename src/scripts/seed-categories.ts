import { categories as categoriesList } from "@/data/categories";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema/categories";

async function main() {
  console.log("Seeding categories");

  try {
    await db.insert(categories).values(categoriesList);

    console.log("Categories seeded successfully");
  } catch (error) {
    console.log("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
