import {
  addOperation,
  addStartingNumber,
  deleteDiscussion,
  getAllDiscussions,
} from "@/controllers/discussion.js";
import { verifyAuth } from "@/middlewares/verifyAuth.js";
import { Router } from "express";

const discussionRoutes = Router();
discussionRoutes.use(verifyAuth);
discussionRoutes.get("/", getAllDiscussions);
discussionRoutes.post("/start", addStartingNumber);
discussionRoutes.post("/operation", addOperation);
discussionRoutes.delete("/:id", deleteDiscussion);

export { discussionRoutes };
