import { type Request, type Response } from "express";

import supabase from "../../_supabase/client";
import HandleResponse from "../../models/waitList/handleResponseWaitList";
import { waitListValidate } from "../../validations/waitListValidate";

/**
 * Create Wait List
 * @param req {Request}
 * @param resp {Response}
 * @returns {Promise<void>}
 */
export const createWaitList = async (req: Request, resp: Response) => {
    const { error } = waitListValidate(req.body);
    if (error) {
        return resp.status(400).send({ error: error?.details[0].message });
    }
    await supabase
        .from("waitlist")
        .insert(HandleResponse.createWaitList(req.body))
        .then(response => {
            if (response.data === undefined) {
                resp.send({ message: "Successfully added to wait list." });
            }
            else {
                resp.status(400).send(response.error);
            }
        });
};
