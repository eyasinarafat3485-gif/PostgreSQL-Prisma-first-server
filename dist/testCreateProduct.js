"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("./services/product.service"));
const prisma_1 = __importDefault(require("./lib/prisma"));
async function test() {
    const category = await prisma_1.default.category.findFirst();
    const user = await prisma_1.default.user.findFirst();
    if (!category || !user) {
        console.error("Missing category or user for test!");
        return;
    }
    const result = await product_service_1.default.createProduct({
        title: "Classic Oxford Cotton Shirt Test",
        price: 36.99,
        description: "A timeless regular-fit Oxford shirt made from breathable cotton fabric.",
        imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        categoryId: category.id,
        userId: user.id,
        status: "ACTIVE",
    });
    console.log("Successfully created product in DB:", result.id, result.title, result.imageUrl);
}
test()
    .catch(console.error)
    .finally(() => prisma_1.default.$disconnect());
