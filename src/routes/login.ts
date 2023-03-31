import { Router } from "express";

import supabase from "../_supabase/client";
import { validateUser } from "../models/login";
const router = Router();

/**
 * @route POST api/login
 * @desc Login user
 */
router.post("/", async (req, resp) => {
    const { error } = validateUser(req.body);
    if (error) {
        return resp.status(400).send({ errors: error?.details[0].message });
    }

    const { email, password } = req.body;

    await supabase.auth
        .signInWithPassword({
            email,
            password,
        })
        .then(response => {
            if (response?.data?.user === undefined) {
                return resp.status(400).send(response?.error);
            }
            const { access_token, token_type, expires_in, refresh_token } =
                response?.data?.session;

            const email = response?.data?.user?.email;
            supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .then(res => {
                    resp.send({
                        token: {
                            access_token,
                            token_type,
                            expires_in,
                            refresh_token
                        },
                        status: res?.statusText,
                        user: res?.data
                    });
                });
        });
});

export default router;
