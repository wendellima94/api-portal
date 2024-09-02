import express from "express";
import {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getOneSubCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Rotas de Categorias
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getOneCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Rotas de SubCategorias
router.post("/categories/:id/subcategories", addSubCategory);
router.get("/categories/:id/subcategories", getSubCategories);
router.get("/categories/:id/subcategories/:subCategoryId", getOneSubCategory);
router.put("/categories/:id/subcategories/:subCategoryId", updateSubCategory);
router.delete(
  "/categories/:id/subcategories/:subCategoryId",
  deleteSubCategory
);

export default router;
