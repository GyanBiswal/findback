import express from "express";
import {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  markRecovered,
} from "../controllers/itemController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Order matters: /my must come before /:id so "my" isn't parsed as an ID
router.get("/my", protect, getMyItems);

router.route("/").post(protect, createItem).get(getItems);

router
  .route("/:id")
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.patch("/:id/recover", protect, markRecovered);

export default router;