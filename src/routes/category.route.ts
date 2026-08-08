import { Router, Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, authorizeRoles("ADMIN"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id as string);
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
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, authorizeRoles("ADMIN"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await CategoryService.updateCategory(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, authorizeRoles("ADMIN"), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await CategoryService.softDeleteCategory(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

export const CategoryRoutes = router;
export default CategoryRoutes;
