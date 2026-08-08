import { Router, Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { auth } from "../middlewares/auth.middleware";
import { Status } from "@prisma/client";

const router = Router();

router.post("/", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productData = {
      ...req.body,
      userId: req.user!.id,
    };
    
    const product = await ProductService.createProduct(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId, status } = req.query;
    
    const products = await ProductService.getAllProducts({
      categoryId: categoryId ? String(categoryId) : undefined,
      status: status ? (status as Status) : undefined,
    });
    
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await ProductService.getProductById(req.params.id as string);
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
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await ProductService.updateProduct(
      req.params.id as string,
      req.body,
      req.user!.id,
      req.user!.role
    );
    
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await ProductService.softDeleteProduct(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

export const ProductRoutes = router;
export default ProductRoutes;
