import { Router } from "express";

import { loginSuperAdmin } from "../controllers/auth/superAdminAuthController";
const router = Router();

/**
 * @route POST api/super-admin/login
 * @desc Login super admin
 */
router.post("/", loginSuperAdmin);

export default router;
