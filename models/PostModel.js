import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: true,
      maxLength: [100, "Title can not be more than 100 characters"],
    },
    content: {
      type: String,
      // required: true,
    },
    author: {
      type: String,
      // required: true,
      maxLength: [50, "Author name can not be more than 50 characters"],
    },
    file: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category.subCategories",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default mongoose.model("Post", PostSchema);
