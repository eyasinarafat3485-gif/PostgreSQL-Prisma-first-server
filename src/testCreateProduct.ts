import ProductService from "./services/product.service";
import prisma from "./lib/prisma";

async function test() {
  const category = await prisma.category.findFirst();
  const user = await prisma.user.findFirst();

  if (!category || !user) {
    console.error("Missing category or user for test!");
    return;
  }

  const result = await ProductService.createProduct({
    title: "Classic Oxford Cotton Shirt Test",
    price: 36.99,
    description: "A timeless regular-fit Oxford shirt made from breathable cotton fabric.",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    categoryId: category.id,
    userId: user.id,
    status: "ACTIVE",
  } as any);

  console.log("Successfully created product in DB:", result.id, result.title, result.imageUrl);
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
