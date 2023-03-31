import { Router } from "express";

import supabase from "../_supabase/client";
import { createWaitList } from "../controllers/waitingList/waitingListController";
const router = Router();

/**
 * @route POST api/wait-list
 * @desc Create wait list
 */
router.post("/", createWaitList);

export default router;
