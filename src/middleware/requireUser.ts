import { type NextFunction, type Request, type Response } from "express";

export default function requireUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json("Unauthorized. No user found.");
    }

    return next();
}
