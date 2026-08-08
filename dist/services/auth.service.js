"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const registerUser = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, saltRounds);
    const user = await prisma_1.default.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
const loginUser = async (data) => {
    const { email, password } = data;
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user || user.isDeleted) {
        throw new Error("Invalid email or password");
    }
    if (user.status === "INACTIVE") {
        throw new Error("User account is inactive");
    }
    const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid email or password");
    }
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
    const { password: _, ...userWithoutPassword } = user;
    return {
        accessToken: token,
        user: userWithoutPassword,
    };
};
const getMe = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user || user.isDeleted) {
        throw new Error("User not found");
    }
    return user;
};
exports.AuthService = {
    registerUser,
    loginUser,
    getMe,
};
exports.default = exports.AuthService;
