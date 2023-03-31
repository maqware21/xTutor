// @ts-nocheck
import { type NextFunction, type Request, type Response } from "express";

import supabase from "../_supabase/client";

export default async function deserialiseUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
    ) {
        return next();
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    const user = await supabase.auth.getUser(accessToken);

    if (!user) {
        return next();
    }

    req.user = user;

    return next();
}
