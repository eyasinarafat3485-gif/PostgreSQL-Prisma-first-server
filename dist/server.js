"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 5000;
const startServer = async () => {
    try {
        app_1.default.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
};
startServer();
