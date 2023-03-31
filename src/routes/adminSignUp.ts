import { Router } from "express";

import { signUpAdmin } from "../controllers/auth/adminAuthController";
const router = Router();

/**
 * @route POST api/admin/signup
 * @desc Register admin
 */
router.post("/", signUpAdmin);

export default router;
