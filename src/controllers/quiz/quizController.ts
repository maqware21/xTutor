import supabase from "../../_supabase/client";
import HandleResponse from "../../models/quiz/handleResponseQuiz";
import { validateQuiz } from "../../validations/quizValidate";

/**
 * get all quiz
 * @param req {Request}
 * @param resp {Response}
 * @returns {Promise<void>} void
 */
export const getAllQuiz = async (req, resp) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }
    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            return resp.status(401).send({ message: "Unauthorized" });
        }
        await supabase
            .from("quiz")
            .select("*")
            .then(async response => {
                const { data, statusText, error } = response;
                if (data && statusText === "OK") {
                    return resp.send(data);
                }
                return resp.status(401).send(error?.message);
            });
    });
};

/**
 * Add new quiz
 * @param req {Request}
 * @param resp {Response}
 * @returns {Promise<void>} void
 */
export const addNewQuiz = async (req, resp) => {
    const { error } = validateQuiz(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0]?.message });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }
    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            return resp.status(401).send({ message: "Unauthorized" });
        }
        await supabase
            .from("quiz")
            .insert(HandleResponse.createQuiz(req.body))
            .then(res => {
                const { data, statusText } = res;
                if (data === undefined && statusText === undefined) {
                    return resp.status(400).send({ message: error?.message });
                }
                return resp.send({ message: "Quiz successfully created" });
            });
    });
};

/**
 * Update quiz
 * @param req {Request}
 * @param resp {Response}
 * @returns {Promise<void>} void
 */
export const updateQuiz = async (req, resp) => {
    const { error } = validateQuiz(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0]?.message });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }

    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            return resp.status(401).send({ message: "Unauthorized" });
        }

        await supabase
            .from("quiz")
            .update(HandleResponse.createQuiz(req.body))
            .eq("quiz_uuid", req.params.id)
            .then(res => {
                if (res?.error) {
                    return resp.status(401).send({
                        message: res?.error?.message
                    });
                }
                return resp.send({message: "Lesson successfully updated."});
            });
    });
};

/**
 * Delete quiz
 * @param req {Request}
 * @param resp {Response}
 * @returns {Promise<void>} void
 */
export const deleteQuiz = async (req, resp) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (token === undefined) {
        return resp.status(401).send({ message: "Unauthorized" });
    }
    await supabase.auth.getUser(token).then(async response => {
        if (response?.data?.user === undefined) {
            resp.status(401).send({ message: "Unauthorized" });
        }
        else {
            const { email, role } = response?.data?.user;
            await supabase
                .from("superAdmin")
                .select("*")
                .eq("email", email)
                .then(async res => {
                    const { data, error, statusText } = res;
                    if (data && statusText === "OK") {
                        await supabase
                            .from("quiz")
                            .delete()
                            .eq("quiz_uuid", req.params.id)
                            .then(response => {
                                if (response?.error) {
                                    resp.status(400).send({
                                        message: response?.error?.message
                                    });
                                }
                                else {
                                    resp.send({
                                        message:
                                            "Quiz successfully deleted.",
                                    });
                                }
                            });
                    }
                });
        }
    });
};
