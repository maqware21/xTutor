// @ts-nocheck
import { Router } from "express";

import { supabase } from "../_supabase/client";

export const router = Router();

/**
 * @route POST api/reset-password
 * @desc Reset password
 */
router.post("/", async (req, resp) => {
    const { email } = req.body;

    await supabase.auth.resetPasswordForEmail(email).then(response => {
        resp.send({ message: "Kindly check your email for reset password." });
    });
});

export default router;
