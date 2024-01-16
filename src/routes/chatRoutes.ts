import express from "express";
import { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } from "../controller/chatControllers.js";
import  protect  from "../middleware/authMiddleware.js";
const router = express.Router();

// get all chats of the user
router.get("/", protect, fetchChats);

//create or access chat
router.post("/", protect, accessChat);
router.post("/group", protect, createGroupChat);

router.put("/rename", protect, renameGroup);
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);

export default router;
