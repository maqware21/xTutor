import supabase from "../../_supabase/client";
import HandleResponse from "../../models/auth/handleResponseSuperAdmin";
import {validateSALogin,validateSASignUp} from "../../validations/superAdmin";

/**
 * Register Super Admin
 * @param req Request object
 * @param resp Response object
 * @returns {Promise<void>} void
 */
export const registerSuperAdmin = async (req, resp) => {
    const { error } = validateSASignUp(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    const { email } = req.body;

    await supabase
        .from("superAdmin")
        .select("email")
        .eq("email", email)
        .then(async res => {
            if (res?.status === 200 && res?.data?.[0]?.email === email) {
                return resp.status(400).send({
                    message: "The email is taken. Try another.",
                });
            }

            try {
                const { data, error } = await supabase.auth.signUp(
                    HandleResponse.handleRegisterSuperAdmin(req.body)
                );

                if (data) {
                    const { error } = await supabase
                        .from("superAdmin")
                        .insert(HandleResponse.createSuperAdmin(req.body));
                    if (error) {
                        return resp.status(400).send(error?.message);
                    }
                    return resp.send({
                        message: "Kindly check your email to activate your account.",
                    });
                }
            }
            catch (error) {
                return resp.status(400).send(error);
            }
        });
};

/**
 * Login Super Admin
 * @param req Request object
 * @param resp Response object
 * @returns {Promise<void>} void
 */
export const loginSuperAdmin = async (req, resp) => {
    const { error } = validateSALogin(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }

    await supabase.auth
        .signInWithPassword(HandleResponse.login(req.body))
        .then(async response => {
            if (response?.data?.user === undefined) {
                return resp.status(400).send({ message: response?.error?.message });
            }
            const email = response?.data?.user?.email;
            supabase
                .from("superAdmin")
                .select("*")
                .eq("email", email)
                .then(res => {
                    return resp.status(200).send(HandleResponse.loginResponse(response, res));
                });
        });
};
