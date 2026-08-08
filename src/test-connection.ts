import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("Loading connection string:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("Connection error Details:", err);
  } else {
    console.log("SUCCESSFULLY CONNECTED to the database via pg Pool!");
    release();
  }
  process.exit(0);
});
