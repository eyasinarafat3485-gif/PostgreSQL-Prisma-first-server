import prisma from "./lib/prisma";

async function main() {
  console.log("Seeding 12+ unique products...");

  // Find or create default user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Eyasin Arafat",
        email: "admin@example.com",
        password: "$2b$10$hashedpasswordplaceholder",
        role: "ADMIN",
        status: "ACTIVE",
      },
    });
  }

  // Ensure categories exist
  const categoryNames = ["Electronics", "Books", "Fashion", "Home & Gadgets", "Gaming"];
  const categoriesMap: Record<string, string> = {};

  for (const name of categoryNames) {
    let cat = await prisma.category.findUnique({ where: { name } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name } });
    }
    categoriesMap[name] = cat.id;
  }

  const productsData = [
    {
      title: "Wireless Noise-Canceling Headphones",
      price: 249.99,
      description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal clear sound.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80",
      categoryName: "Electronics",
      status: "ACTIVE",
    },
    {
      title: "Mechanical RGB Gaming Keyboard",
      price: 119.50,
      description: "Tactile mechanical switches with customizable per-key RGB backlighting and durable aluminum frame.",
      imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700&auto=format&fit=crop&q=80",
      categoryName: "Electronics",
      status: "ACTIVE",
    },
    {
      title: "Ultra-Wide 34-Inch Curved Monitor",
      price: 599.99,
      description: "144Hz refresh rate, 1ms response time, HDR400, and QHD resolution for immersive gaming and productivity.",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&auto=format&fit=crop&q=80",
      categoryName: "Gaming",
      status: "ACTIVE",
    },
    {
      title: "Ergonomic Mesh Office Chair",
      price: 189.00,
      description: "Adjustable lumbar support, 3D armrests, and breathable mesh fabric for all-day comfort.",
      imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=700&auto=format&fit=crop&q=80",
      categoryName: "Home & Gadgets",
      status: "ACTIVE",
    },
    {
      title: "Smart Fitness Watch Series 7",
      price: 199.99,
      description: "Heart rate monitor, GPS tracking, sleep analytics, and 50m water resistance with vibrant OLED screen.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80",
      categoryName: "Electronics",
      status: "ACTIVE",
    },
    {
      title: "Classic Leather Minimalist Wallet",
      price: 39.95,
      description: "Handcrafted genuine leather wallet with RFID blocking technology and slim front-pocket design.",
      imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=80",
      categoryName: "Fashion",
      status: "ACTIVE",
    },
    {
      title: "4K Ultra HD Action Camera",
      price: 149.99,
      description: "Waterproof up to 30m, dual screens, electronic image stabilization, and 60fps video recording.",
      imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&auto=format&fit=crop&q=80",
      categoryName: "Electronics",
      status: "ACTIVE",
    },
    {
      title: "The Art of Modern Software Design",
      price: 29.99,
      description: "A comprehensive handbook covering clean architecture, microservices design patterns, and system scaling.",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=700&auto=format&fit=crop&q=80",
      categoryName: "Books",
      status: "ACTIVE",
    },
    {
      title: "Urban Waterproof Backpack",
      price: 69.99,
      description: "Padded 15.6-inch laptop compartment, hidden anti-theft pocket, and water-repellent fabric.",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=80",
      categoryName: "Fashion",
      status: "ACTIVE",
    },
    {
      title: "Wireless Bluetooth Soundbar",
      price: 89.99,
      description: "Deep bass subwoofer boost, Bluetooth 5.3 connection, and sleek metallic home theater design.",
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=700&auto=format&fit=crop&q=80",
      categoryName: "Electronics",
      status: "ACTIVE",
    },
    {
      title: "Precision Coffee Drip Brewer",
      price: 54.50,
      description: "Stainless steel mesh filter, heat-resistant borosilicate glass carafe, and pour-over kettle compatibility.",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80",
      categoryName: "Home & Gadgets",
      status: "ACTIVE",
    },
    {
      title: "Retro Mechanical Pocket Watch",
      price: 45.00,
      description: "Vintage skeleton dial movement with antique bronze chain and carved flip case.",
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=700&auto=format&fit=crop&q=80",
      categoryName: "Fashion",
      status: "ACTIVE",
    },
  ];

  for (const item of productsData) {
    await prisma.product.create({
      data: {
        title: item.title,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        categoryId: categoriesMap[item.categoryName],
        userId: user.id,
        status: item.status as any,
      },
    });
  }

  console.log(`Successfully seeded ${productsData.length} unique products!`);
}

main()
  .catch((err) => console.error("Seeding error:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
