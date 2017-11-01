import express from "express";
import CategoriesRouter from "./categoriesRouter";
import MaterialsRouter from "./materialsRouter";

const router = express.Router();
router.use("/categories", CategoriesRouter);
router.use("/materials", MaterialsRouter);
export default router;
