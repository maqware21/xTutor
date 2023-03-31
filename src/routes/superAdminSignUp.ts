import { Router } from "express";

import { registerSuperAdmin } from "../controllers/auth/superAdminAuthController";
const router = Router();

/**
 * @route POST api/super-admin/signup
 * @desc Register super admin
 */
router.post("/", registerSuperAdmin);

export default router;
