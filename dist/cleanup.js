"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
async function main() {
    console.log("Cleaning up soft-deleted products from database...");
    // Find products marked as isDeleted: true
    const deletedProducts = await prisma_1.default.product.findMany({
        where: { isDeleted: true },
    });
    for (const product of deletedProducts) {
        console.log(`Permanently deleting product from database table: ${product.title} (${product.id})`);
        await prisma_1.default.review.deleteMany({ where: { productId: product.id } });
        await prisma_1.default.product.delete({ where: { id: product.id } });
    }
    console.log("Cleanup complete!");
}
main()
    .catch((err) => console.error("Cleanup error:", err))
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
