// backend/routes/auth.js
// -----------------
import express from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// register
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  register
);

// login
router.post("/login", login);

// current user
router.get("/me", auth, getMe);

export default router;
