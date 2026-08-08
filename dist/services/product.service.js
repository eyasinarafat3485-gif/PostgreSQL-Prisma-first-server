"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createProduct = async (data) => {
    return await prisma_1.default.product.create({
        data,
    });
};
const getAllProducts = async (filters) => {
    const where = {
        isDeleted: false,
    };
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    return await prisma_1.default.product.findMany({
        where,
        include: {
            category: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
const getProductById = async (id) => {
    const product = await prisma_1.default.product.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            reviews: {
                where: {
                    isDeleted: false,
                },
            },
        },
    });
    if (!product || product.isDeleted) {
        return null;
    }
    return product;
};
const updateProduct = async (id, data, reqUserId, reqUserRole) => {
    const product = await prisma_1.default.product.findUnique({
        where: { id },
    });
    if (!product || product.isDeleted) {
        throw new Error("Product not found");
    }
    // Creator or Admin check
    if (product.userId !== reqUserId && reqUserRole !== "ADMIN") {
        throw new Error("You do not have permission to update this product");
    }
    return await prisma_1.default.product.update({
        where: { id },
        data,
    });
};
const softDeleteProduct = async (id, reqUserId, reqUserRole) => {
    const product = await prisma_1.default.product.findUnique({
        where: { id },
    });
    if (!product || product.isDeleted) {
        throw new Error("Product not found");
    }
    // Creator or Admin check
    if (product.userId !== reqUserId && reqUserRole !== "ADMIN") {
        throw new Error("You do not have permission to delete this product");
    }
    return await prisma_1.default.product.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
};
exports.ProductService = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    softDeleteProduct,
};
exports.default = exports.ProductService;
