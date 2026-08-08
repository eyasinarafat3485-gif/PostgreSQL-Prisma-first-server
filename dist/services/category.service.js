"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createCategory = async (data) => {
    return await prisma_1.default.category.create({
        data,
    });
};
const getAllCategories = async () => {
    return await prisma_1.default.category.findMany({
        where: {
            isDeleted: false,
        },
    });
};
const getCategoryById = async (id) => {
    const category = await prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!category || category.isDeleted) {
        return null;
    }
    return category;
};
const updateCategory = async (id, data) => {
    // Ensure the category exists and is not soft deleted before updating
    const category = await getCategoryById(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return await prisma_1.default.category.update({
        where: {
            id,
        },
        data,
    });
};
const softDeleteCategory = async (id) => {
    // Ensure the category exists and is not soft deleted before deleting
    const category = await getCategoryById(id);
    if (!category) {
        throw new Error("Category not found");
    }
    return await prisma_1.default.category.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
};
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    softDeleteCategory,
};
exports.default = exports.CategoryService;
