import { Router } from "express";
import { getCategories, getProductBySlug, listProducts } from "../controllers/productController";

const router = Router();

// 1. Static routes first
router.get("/", listProducts);
router.get("/categories", getCategories);

// 2. Dynamic/parameterized routes last
router.get("/:slug", getProductBySlug);

export default router;