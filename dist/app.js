"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Application Routes
app.use("/api/v1", routes_1.default);
// Root Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the SCIC/EJP-13 Express + Prisma API!",
    });
});
// 404 Handler
app.use(notFound_1.default);
// Global Error Handler
app.use(globalErrorHandler_1.default);
exports.default = app;
