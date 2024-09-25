import Post from "../models/PostModel.js";
import { uploadFiles } from "./uploadController.js";

export const createPost = async (req, res) => {
  // Wrap in a function to use `uploadFiles` middleware
  const uploadMiddleware = (req, res, next) => {
    uploadFiles(req, res, next);
  };

  uploadMiddleware(req, res, async () => {
    try {
      console.log("Arquivos recebidos:", req.files);

      const fileNames = req.files.map((file) => file.filename);

      const { title, content, author } = req.body;

      // Validação de campos obrigatórios
      if (!title || !content || !author) {
        return res.status(400).json({
          message: "Required fields are missing.",
        });
      }

      const newPost = new Post({
        title,
        content,
        author,
        file: fileNames,
      });

      const savedPost = await newPost.save();

      return res.status(201).json({
        message: "Post created successfully.",
        post: savedPost,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({
        message: "An error occurred while creating the post.",
        error: error.message,
      });
    }
  });
};

export default createPost;
