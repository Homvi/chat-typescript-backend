import express from "express";
const router = express.Router();
import { sendMessage, allMessages } from "../controller/messageControllers.js";
import protect from "../middleware/authMiddleware.js";
router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);
export default router;
//# sourceMappingURL=messageRoutes.js.map