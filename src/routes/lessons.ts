import { Router } from "express";
import formidableMiddleware from "express-formidable";
import multer from "multer";

import {
    createLesson,
    deleteLesson,
    getAllLessons,
    updateLesson,
} from "../controllers/lessons/lessonsController";
const router = Router();

router.use(
    formidableMiddleware({
        encoding: "utf-8",
        multiples: true // req.files to be arrays of files
    })
);

/**
 * @route GET api/lessons
 * @desc Get all lessons
 */
router.get("/", getAllLessons);

/**
 * @route POST api/lessons
 * @desc Create lesson
 */
router.post("/", createLesson);

/**
 * @route PUT api/lessons/:id
 * @desc Update lesson
 */
router.put("/:id", updateLesson);

/**
 * @route DELETE api/lessons/:id
 * @desc Delete lesson
 */
router.delete("/:id", deleteLesson);

export default router;
