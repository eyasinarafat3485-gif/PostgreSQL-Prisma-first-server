import prisma from "./lib/prisma";

async function main() {
  console.log("Cleaning up soft-deleted products from database...");
  
  // Find products marked as isDeleted: true
  const deletedProducts = await prisma.product.findMany({
    where: { isDeleted: true },
  });

  for (const product of deletedProducts) {
    console.log(`Permanently deleting product from database table: ${product.title} (${product.id})`);
    await prisma.review.deleteMany({ where: { productId: product.id } });
    await prisma.product.delete({ where: { id: product.id } });
  }

  console.log("Cleanup complete!");
}

main()
  .catch((err) => console.error("Cleanup error:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
