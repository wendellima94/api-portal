import express from "express";
import {
  createPost,
  // getAllPosts,
  // getOnePost,
  // updatePost,
  // deletePost,
} from "../controllers/PostsController.js";

const router = express.Router();

router.post("/create", createPost); // Rota para criar posts
// router.get("/posts", getAllPosts); // Rota para listar todos os posts
// router.get("/posts/:id", getOnePost); // Rota para buscar um post específico
// router.put("/posts/:id", updatePost); // Rota para atualizar um post
// router.delete("/posts/:id", deletePost); // Rota para deletar um post

export default router;
