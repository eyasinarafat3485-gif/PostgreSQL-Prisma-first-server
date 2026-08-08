import { Router } from "express";
import { UserRoutes } from "./user.route";
import { AuthRoutes } from "./auth.route";
import { CategoryRoutes } from "./category.route";
import { ProductRoutes } from "./product.route";
import { ReviewRoutes } from "./review.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
