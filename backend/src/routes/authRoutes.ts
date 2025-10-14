import express from "express";
import { register, login, logout, checkAuthStatus } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get('/status', protect, checkAuthStatus); 


export default router;
