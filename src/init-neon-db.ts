import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  const client = await pool.connect();
  try {
    console.log("Creating Enums and Tables on Neon Cloud Database...");

    // Create ENUMs
    try {
      await client.query(`CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');`);
    } catch (e: any) {
      console.log("UserRole ENUM already exists or created.");
    }

    try {
      await client.query(`CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');`);
    } catch (e: any) {
      console.log("Status ENUM already exists or created.");
    }

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "role" "UserRole" NOT NULL DEFAULT 'USER',
        "status" "Status" NOT NULL DEFAULT 'ACTIVE',
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "categories" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "description" TEXT,
        "imageUrl" TEXT,
        "categoryId" TEXT NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "status" "Status" NOT NULL DEFAULT 'ACTIVE',
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "reviews" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "rating" INTEGER NOT NULL,
        "comment" TEXT,
        "productId" TEXT NOT NULL REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully on Neon Cloud Database!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
