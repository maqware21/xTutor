import { Router } from "express";

import routeProtection, {
    TEACHER_ACCESS_LEVEL,
} from "../middleware/routeProtection";
import adminLoginRouter from "./adminLogin";
import adminSignUpRouter from "./adminSignUp";
import authRouter from "./auth";
import lessonsRouter from "./lessons";
import loginRouter from "./login";
import quizRouter from "./quiz";
import resetPasswordRouter from "./resetPassword";
import superAdminLoginRouter from "./superAdminLogin";
import superAdminSignupRouter from "./superAdminSignUp";
import waitListRouter from "./waitList";

const router = Router();

router.use("/register", authRouter);
router.use("/login", loginRouter);
router.use("/super-admin-sign-up", superAdminSignupRouter);
router.use("/super-admin-login", superAdminLoginRouter);
router.use("/admin-sign-up", adminSignUpRouter);
router.use("/admin-login", adminLoginRouter);
router.use("/reset-password", resetPasswordRouter);
router.use("/lessons", routeProtection(TEACHER_ACCESS_LEVEL), lessonsRouter);
router.use("/wait-list", waitListRouter);
router.use("/quiz", quizRouter);

export default router;
