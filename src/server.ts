import dotenv from "dotenv";
// Load environment variables
dotenv.config();

import app from "./app";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();