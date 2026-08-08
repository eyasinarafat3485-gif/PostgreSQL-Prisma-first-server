"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Loading connection string:", process.env.DATABASE_URL);
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.connect((err, client, release) => {
    if (err) {
        console.error("Connection error Details:", err);
    }
    else {
        console.log("SUCCESSFULLY CONNECTED to the database via pg Pool!");
        release();
    }
    process.exit(0);
});
