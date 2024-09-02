import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: [100, "Title can not be more than 100 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category.subCategories._id",
        required: true,
      },
    ],
    description: {
      type: String,
      maxLength: [500, "Description can not be more than 500 characters"],
    },
    imageUrl: {
      type: String, 
      required: false,
    },
    image: {
      type: Buffer, 
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
