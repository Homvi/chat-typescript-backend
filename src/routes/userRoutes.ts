import express from "express";

const router = express.Router();

import { registerUser, authUser, allUsers } from "../controller/userControllers.js";
import  protect  from "../middleware/authMiddleware.js";

router.get("/", protect, allUsers);

router.post("/", registerUser);
router.post("/login", authUser);

export default router;
