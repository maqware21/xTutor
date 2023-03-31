import { type Request, type Response, Router } from "express";

import supabase from "../_supabase/client";
import { validateUser } from "../models/auth";

const router = Router();

interface User {
  name: string
  email: string
  password: string
  phone_number: string
  educational_level: string
  main_subjects: string[]
}

/**
 * @route POST api/auth
 * @desc Register user
 */
router.post("/", async (req: Request, resp: Response) => {
    const { error } = validateUser(req.body);
    if (error) {
        return resp.status(400).send({ error: error.details[0].message });
    }

    const {
        name,
        email,
        password,
        phone_number,
        educational_level,
        main_subjects,
    } = req.body as User;

    await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .then(async res => {
            if (res?.status === 200 && res?.data?.[0]?.email === email) {
                resp.status(409).send({
                    message: "The email is taken. Try another.",
                });
            }
            else {
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                    });

                    if (data) {
                        const { error } = await supabase.from("users").insert({
                            name,
                            email,
                            password,
                            phone_number,
                            educational_level,
                            main_subjects,
                            uuid: data?.user?.id
                        });
                    }

                    if (error) {
                        resp.status(400).send(error?.message);
                    }
                    resp.send({
                        message:
                            "Kindly check your email to activate your account.",
                    });
                }
                catch (error) {
                    resp.status(400).send(error);
                }
            }
        });
});

export default router;
