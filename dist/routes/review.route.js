"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_service_1 = require("../services/review.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const reviewData = {
            ...req.body,
            userId: req.user.id,
        };
        const review = await review_service_1.ReviewService.createReview(reviewData);
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const reviews = await review_service_1.ReviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/product/:productId", async (req, res, next) => {
    try {
        const reviews = await review_service_1.ReviewService.getReviewsByProduct(req.params.productId);
        res.status(200).json({
            success: true,
            message: "Product reviews fetched successfully",
            data: reviews,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const review = await review_service_1.ReviewService.updateReview(req.params.id, req.body, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", auth_middleware_1.auth, async (req, res, next) => {
    try {
        const review = await review_service_1.ReviewService.softDeleteReview(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ReviewRoutes = router;
exports.default = exports.ReviewRoutes;
