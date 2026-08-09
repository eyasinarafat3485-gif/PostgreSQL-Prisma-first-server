"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
async function main() {
    console.log("Seeding 12 new modern unique products...");
    let user = await prisma_1.default.user.findFirst();
    if (!user) {
        user = await prisma_1.default.user.create({
            data: {
                name: "Eyasin Arafat",
                email: "admin@example.com",
                password: "$2b$10$hashedpasswordplaceholder",
                role: "ADMIN",
                status: "ACTIVE",
            },
        });
    }
    const categoryNames = ["Electronics", "Books", "Fashion", "Home & Gadgets", "Gaming"];
    const categoriesMap = {};
    for (const name of categoryNames) {
        let cat = await prisma_1.default.category.findUnique({ where: { name } });
        if (!cat) {
            cat = await prisma_1.default.category.create({ data: { name } });
        }
        categoriesMap[name] = cat.id;
    }
    const newProductsData = [
        {
            title: "Apple MacBook Pro M3 Max",
            price: 1999.99,
            description: "16-inch Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD storage in Space Black.",
            imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80",
            categoryName: "Electronics",
            status: "ACTIVE",
        },
        {
            title: "Sony PlayStation 5 DualSense Controller",
            price: 69.99,
            description: "Haptic feedback, dynamic adaptive triggers, and built-in microphone in Midnight Black.",
            imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&auto=format&fit=crop&q=80",
            categoryName: "Gaming",
            status: "ACTIVE",
        },
        {
            title: "Minimalist Ceramic Desk Mug Warmer",
            price: 28.50,
            description: "Automatic gravity-sensor auto shutoff heating coaster with constant 55°C temperature control.",
            imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80",
            categoryName: "Home & Gadgets",
            status: "ACTIVE",
        },
        {
            title: "Designing Data-Intensive Applications",
            price: 44.99,
            description: "The definitive guide to data systems, storage engines, distributed consensus, and replication.",
            imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80",
            categoryName: "Books",
            status: "ACTIVE",
        },
        {
            title: "Polarized Titanium Aviator Sunglasses",
            price: 85.00,
            description: "Ultra-lightweight titanium alloy frame with 100% UV400 protection anti-glare lenses.",
            imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=700&auto=format&fit=crop&q=80",
            categoryName: "Fashion",
            status: "ACTIVE",
        },
        {
            title: "Logitech MX Master 3S Wireless Mouse",
            price: 99.99,
            description: "8K DPI track-on-glass sensor, quiet click switches, and dual Bluetooth/Logi Bolt receiver.",
            imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700&auto=format&fit=crop&q=80",
            categoryName: "Electronics",
            status: "ACTIVE",
        },
        {
            title: "Wireless RGB Mechanical Numpad",
            price: 49.99,
            description: "Hot-swappable yellow linear switches, PBT keycaps, and triple mode 2.4GHz/BT/Type-C connection.",
            imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80",
            categoryName: "Gaming",
            status: "ACTIVE",
        },
        {
            title: "Smart Ambient LED Studio Light Bar",
            price: 64.90,
            description: "App-controlled sync with screen colors, music reactive mode, and magnetic desk mounting.",
            imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80",
            categoryName: "Home & Gadgets",
            status: "ACTIVE",
        },
        {
            title: "Premium Italian Leather Chelsea Boots",
            price: 159.00,
            description: "Handcrafted full-grain calfskin leather with memory foam insoles and Goodyear welt construction.",
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80",
            categoryName: "Fashion",
            status: "ACTIVE",
        },
        {
            title: "Clean Code: A Handbook of Agile Craftsmanship",
            price: 37.99,
            description: "Robert C. Martin's legendary guide to writing readable, maintainable, and robust code.",
            imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&auto=format&fit=crop&q=80",
            categoryName: "Books",
            status: "ACTIVE",
        },
        {
            title: "Foldable Magnetic 3-in-1 Wireless Charger",
            price: 42.99,
            description: "Fast 15W charging station for iPhone, Apple Watch, and AirPods with travel pouch.",
            imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=700&auto=format&fit=crop&q=80",
            categoryName: "Electronics",
            status: "ACTIVE",
        },
        {
            title: "Noise-Canceling Wireless Studio Earbuds",
            price: 129.99,
            description: "Transparency mode, spatial audio, IPX4 sweat resistance, and 32-hour total playback with USB-C case.",
            imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80",
            categoryName: "Electronics",
            status: "ACTIVE",
        },
    ];
    for (const item of newProductsData) {
        await prisma_1.default.product.create({
            data: {
                title: item.title,
                price: item.price,
                description: item.description,
                imageUrl: item.imageUrl,
                categoryId: categoriesMap[item.categoryName],
                userId: user.id,
                status: item.status,
            },
        });
    }
    console.log(`Successfully seeded ${newProductsData.length} new modern products!`);
}
main()
    .catch((err) => console.error("Seeding error:", err))
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
