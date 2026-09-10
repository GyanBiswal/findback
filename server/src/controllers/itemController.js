import Item from "../models/Item.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create a new lost or found item
// @route   POST /api/items
// @access  Private
export const createItem = asyncHandler(async (req, res) => {
  const { type, title, description, category, brand, color, location, date } =
    req.body;

  if (!type || !title || !description || !category || !location || !date) {
    throw new AppError(
      "type, title, description, category, location and date are required",
      400
    );
  }

  if (!["LOST", "FOUND"].includes(type)) {
    throw new AppError("type must be either LOST or FOUND", 400);
  }

  const item = await Item.create({
    user: req.user._id,
    type,
    title,
    description,
    category,
    brand,
    color,
    location,
    date,
  });

  res.status(201).json({
    success: true,
    item,
  });
});

// @desc    Get all items (basic list, no filters yet)
// @route   GET /api/items
// @access  Public
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    items,
  });
});

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  res.status(200).json({
    success: true,
    item,
  });
});

// @desc    Get items belonging to the logged-in user
// @route   GET /api/items/my
// @access  Private
export const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: items.length,
    items,
  });
});

// @desc    Update an item (owner only)
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (item.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this item", 403);
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "brand",
    "color",
    "location",
    "date",
    "type",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field];
    }
  });

  await item.save();

  res.status(200).json({
    success: true,
    item,
  });
});

// @desc    Delete an item (owner only)
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (item.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to delete this item", 403);
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: "Item deleted successfully",
  });
});

// @desc    Mark an item as recovered (owner only)
// @route   PATCH /api/items/:id/recover
// @access  Private
export const markRecovered = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  if (item.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized to update this item", 403);
  }

  item.status = "RECOVERED";
  await item.save();

  res.status(200).json({
    success: true,
    item,
  });
});