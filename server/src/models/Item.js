import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["LOST", "FOUND"],
      required: [true, "Item type is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    // AI-extracted structured attributes (populated in Phase 9)
    aiAttributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RECOVERED"],
      default: "ACTIVE",
    },
    // Set once a match is accepted (Phase 10/11)
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },
  },
  { timestamps: true }
);

// Speeds up filtering/searching later
itemSchema.index({ type: 1, status: 1, category: 1 });
itemSchema.index({ title: "text", description: "text" });

const Item = mongoose.model("Item", itemSchema);

export default Item;