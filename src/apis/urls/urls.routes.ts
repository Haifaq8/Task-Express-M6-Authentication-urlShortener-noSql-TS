import express from "express";
import { authorize } from "../../middlewares/auth.middleware";
import { shorten, redirect, deleteUrl } from "./urls.controllers";

const router = express.Router();

router.get("/:shortCode", redirect);

router.post("/shorten", authorize, shorten);
router.delete("/:id", authorize, deleteUrl);

export default router;