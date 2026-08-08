"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "You are not authorized to access this route. Token missing.",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            req.user = decoded;
            next();
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: "You are not authorized to access this route. Invalid or expired token.",
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.auth = auth;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "You are not authorized to access this route. Authentication required.",
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource.",
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
