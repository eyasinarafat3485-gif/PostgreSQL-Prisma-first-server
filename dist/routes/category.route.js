"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = require("express");
const category_service_1 = require("../services/category.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, (0, auth_middleware_1.authorizeRoles)("ADMIN"), async (req, res, next) => {
    try {
        const category = await category_service_1.CategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const categories = await category_service_1.CategoryService.getAllCategories();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const category = await category_service_1.CategoryService.getCategoryById(req.params.id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorizeRoles)("ADMIN"), async (req, res, next) => {
    try {
        const category = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", auth_middleware_1.auth, (0, auth_middleware_1.authorizeRoles)("ADMIN"), async (req, res, next) => {
    try {
        const category = await category_service_1.CategoryService.softDeleteCategory(req.params.id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CategoryRoutes = router;
exports.default = exports.CategoryRoutes;
