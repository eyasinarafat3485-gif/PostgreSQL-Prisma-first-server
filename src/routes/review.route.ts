import { Router, Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user!.id,
    };
    
    const review = await ReviewService.createReview(reviewData);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/product/:productId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await ReviewService.getReviewsByProduct(req.params.productId as string);
    res.status(200).json({
      success: true,
      message: "Product reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await ReviewService.updateReview(
      req.params.id as string,
      req.body,
      req.user!.id,
      req.user!.role
    );
    
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await ReviewService.softDeleteReview(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

export const ReviewRoutes = router;
export default ReviewRoutes;
