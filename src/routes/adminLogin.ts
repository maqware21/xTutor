import { Router } from "express";

import { loginAdmin } from "../controllers/auth/adminAuthController";
const router = Router();

/**
 * @route POST api/admin/login
 * @desc Login admin
 */
router.post("/", loginAdmin);

export default router;
