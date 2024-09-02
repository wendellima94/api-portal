import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [20, "Name can not be more than 20 characters"],
    },
    description: {
      type: String,
      maxLength: [50, "Description can not be more than 50 characters"],
    },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: [20, "Name can not be more than 20 characters"],
    },
    subCategories: {
      type: [SubCategorySchema],
      default: [],
    },
    description: {
      type: String,
      maxLength: [50, "Description can not be more than 50 characters"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default mongoose.model("Category", CategorySchema);
