"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const product_service_1 = require("../services/product.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            userId: req.user.id,
        };
        const product = await product_service_1.ProductService.createProduct(productData);
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const { categoryId, status } = req.query;
        const products = await product_service_1.ProductService.getAllProducts({
            categoryId: categoryId ? String(categoryId) : undefined,
            status: status ? status : undefined,
        });
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const product = await product_service_1.ProductService.getProductById(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const product = await product_service_1.ProductService.updateProduct(req.params.id, req.body, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const product = await product_service_1.ProductService.softDeleteProduct(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ProductRoutes = router;
exports.default = exports.ProductRoutes;
