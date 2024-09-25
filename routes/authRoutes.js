import express from "express";
import { login, register } from "../controllers/authController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/ola", (req, res, next) => {
  res.send("Get message");
});

export default router;
