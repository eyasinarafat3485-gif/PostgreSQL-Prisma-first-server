import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.user is guaranteed to be defined by the auth middleware
    const user = await AuthService.getMe(req.user!.id);
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export const AuthRoutes = router;
export default AuthRoutes;
