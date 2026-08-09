"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./lib/prisma"));
dotenv_1.default.config();
async function main() {
    console.log("Starting database seeding...");
    // Clean existing tables (in dependency order)
    await prisma_1.default.review.deleteMany({});
    await prisma_1.default.product.deleteMany({});
    await prisma_1.default.category.deleteMany({});
    await prisma_1.default.user.deleteMany({});
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    // 1. Create Default Users
    const adminPassword = await bcrypt_1.default.hash("admin123", saltRounds);
    const userPassword = await bcrypt_1.default.hash("user123", saltRounds);
    const admin = await prisma_1.default.user.create({
        data: {
            name: "Admin User",
            email: "admin@gmail.com",
            password: adminPassword,
            role: client_1.UserRole.ADMIN,
            status: client_1.Status.ACTIVE,
        },
    });
    const normalUser = await prisma_1.default.user.create({
        data: {
            name: "John Seller",
            email: "user@gmail.com",
            password: userPassword,
            role: client_1.UserRole.USER,
            status: client_1.Status.ACTIVE,
        },
    });
    console.log("Users created: admin@gmail.com (admin123), user@gmail.com (user123)");
    // 2. Create Default Categories
    const electronics = await prisma_1.default.category.create({
        data: { name: "Electronics" },
    });
    const books = await prisma_1.default.category.create({
        data: { name: "Books" },
    });
    const fashion = await prisma_1.default.category.create({
        data: { name: "Fashion" },
    });
    console.log("Categories created: Electronics, Books, Fashion");
    // 3. Create Sample Products
    const phone = await prisma_1.default.product.create({
        data: {
            title: "Smartphone Pro Max",
            price: 999.99,
            description: "A premium flagship smartphone with high-end cameras and processors.",
            categoryId: electronics.id,
            userId: normalUser.id,
            status: client_1.Status.ACTIVE,
        },
    });
    const laptop = await prisma_1.default.product.create({
        data: {
            title: "UltraBook 14 Inch",
            price: 1249.99,
            description: "Super light and fast laptop with long battery life.",
            categoryId: electronics.id,
            userId: admin.id,
            status: client_1.Status.ACTIVE,
        },
    });
    const novel = await prisma_1.default.product.create({
        data: {
            title: "Sci-Fi Novel Chronicles",
            price: 15.99,
            description: "An epic space adventure story across multiple galaxies.",
            categoryId: books.id,
            userId: normalUser.id,
            status: client_1.Status.ACTIVE,
        },
    });
    console.log("Products created: Smartphone, UltraBook, Sci-Fi Novel");
    // 4. Create Sample Reviews
    await prisma_1.default.review.create({
        data: {
            rating: 5,
            comment: "Absolutely amazing phone! Camera is incredible.",
            productId: phone.id,
            userId: admin.id,
        },
    });
    await prisma_1.default.review.create({
        data: {
            rating: 4,
            comment: "Very solid laptop, but a bit expensive.",
            productId: laptop.id,
            userId: normalUser.id,
        },
    });
    console.log("Reviews created.");
    console.log("Seeding complete!");
}
main()
    .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
