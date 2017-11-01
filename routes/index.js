import express from "express";
import path from "path";
import ApiRouter from "./api";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("main", { isHome: true });
});
router.use("/api", ApiRouter);
router.get("/repository", (req, res) => {
  res.render("repository", { isRepository: true });
});

export default router;
