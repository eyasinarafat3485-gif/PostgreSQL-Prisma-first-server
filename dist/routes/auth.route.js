"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth.service");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", async (req, res, next) => {
    try {
        const user = await auth_service_1.AuthService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const result = await auth_service_1.AuthService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", auth_middleware_1.auth, async (req, res, next) => {
    try {
        // req.user is guaranteed to be defined by the auth middleware
        const user = await auth_service_1.AuthService.getMe(req.user.id);
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthRoutes = router;
exports.default = exports.AuthRoutes;
