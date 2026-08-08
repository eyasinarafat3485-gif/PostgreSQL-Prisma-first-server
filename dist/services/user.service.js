"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createUser = async (data) => {
    return await prisma_1.default.user.create({
        data,
    });
};
const getAllUsers = async () => {
    return await prisma_1.default.user.findMany({
        where: {
            isDeleted: false,
        },
    });
};
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!user || user.isDeleted) {
        return null;
    }
    return user;
};
const updateUser = async (id, data) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma_1.default.user.update({
        where: { id },
        data,
    });
};
const deleteUser = async (id) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return await prisma_1.default.user.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
};
exports.UserService = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
