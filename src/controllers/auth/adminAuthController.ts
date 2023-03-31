import { type Request, type Response } from "express";

import supabase from "../../_supabase/client";
import HandleResponse from "../../models/auth/handleResponseAdmin";
import { validateAdminLogin,validateAdminSignUpRequest }
    from "../../validations/adminValidate";

/**
 * Sign Up Admin
 * @param req Request object
 * @param resp Response object
 * @returns {Promise<void>} void
 */
const signUpAdmin = async (req: Request, resp: Response) => {
    // Validate request
    const { error } = validateAdminSignUpRequest(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    const { email } = req.body.email;

    await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .then(async res => {
            if (res?.status === 200 && res?.data?.[0]?.email === email) {
                return resp.status(409).send({
                    message: "The email is taken. Try another.",
                });
            }

            try {
                const { data, error } = await supabase.auth.signUp(
                    HandleResponse.registerAdmin(req.body)
                );

                if (data) {
                    const { error } = await supabase
                        .from("users")
                        .insert(HandleResponse.createAdmin(req.body, data));
                }
                if (error) {
                    return resp.status(400).send(error?.message);
                }
                return resp.send({
                    message:
                        "Kindly check your email to activate your account.",
                });
            }
            catch (error) {
                resp.status(400).send(error);
            }
        });
};

/**
 * Login Admin
 * @param req Request object
 * @param resp Response object
 * @returns {Promise<void>} void
 */
const loginAdmin = async (req: Request, resp: Response) => {
    const { error } = validateAdminLogin(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    await supabase.auth
        .signInWithPassword(HandleResponse.login(req.body))
        .then(response => {
            if (response?.data?.user === undefined) {
                return resp.status(400).send(response?.error);
            }

            const email = response?.data?.user?.email;
            supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .then(res => {
                    return resp.send(
                        HandleResponse.loginResponse(response, res)
                    );
                });
        });
};

export { loginAdmin,signUpAdmin };
