"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createReview = async (data) => {
    // Check if product exists and is not soft deleted
    const product = await prisma_1.default.product.findUnique({
        where: { id: data.productId },
    });
    if (!product || product.isDeleted) {
        throw new Error("Product not found");
    }
    return await prisma_1.default.review.create({
        data,
    });
};
const getAllReviews = async () => {
    return await prisma_1.default.review.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            product: true,
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
const getReviewsByProduct = async (productId) => {
    // Check if product exists and is not soft deleted
    const product = await prisma_1.default.product.findUnique({
        where: { id: productId },
    });
    if (!product || product.isDeleted) {
        throw new Error("Product not found");
    }
    return await prisma_1.default.review.findMany({
        where: {
            productId,
            isDeleted: false,
        },
        include: {
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
const updateReview = async (id, data, reqUserId, reqUserRole) => {
    const review = await prisma_1.default.review.findUnique({
        where: { id },
    });
    if (!review || review.isDeleted) {
        throw new Error("Review not found");
    }
    // Ownership or Admin check
    if (review.userId !== reqUserId && reqUserRole !== "ADMIN") {
        throw new Error("You do not have permission to update this review");
    }
    return await prisma_1.default.review.update({
        where: { id },
        data: {
            rating: data.rating,
            comment: data.comment,
        },
    });
};
const softDeleteReview = async (id, reqUserId, reqUserRole) => {
    const review = await prisma_1.default.review.findUnique({
        where: { id },
    });
    if (!review || review.isDeleted) {
        throw new Error("Review not found");
    }
    // Ownership or Admin check
    if (review.userId !== reqUserId && reqUserRole !== "ADMIN") {
        throw new Error("You do not have permission to delete this review");
    }
    return await prisma_1.default.review.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });
};
exports.ReviewService = {
    createReview,
    getAllReviews,
    getReviewsByProduct,
    updateReview,
    softDeleteReview,
};
exports.default = exports.ReviewService;
