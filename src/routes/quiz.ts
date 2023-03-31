import { Router } from "express";

import {
    addNewQuiz,
    deleteQuiz,
    getAllQuiz,
    updateQuiz,
} from "../controllers/quiz/quizController";
const router = Router();

/**
 * @route GET api/quiz
 * @desc Get all quiz
 */
router.get("/", getAllQuiz);

/**
 * @route POST api/quiz
 * @desc Create quiz
 */
router.post("/", addNewQuiz);

/**
 * @route PUT api/quiz/:id
 * @desc Update quiz
 */
router.put("/:id", updateQuiz);

/**
 * @route DELETE api/quiz/:id
 * @desc Delete quiz
 */
router.delete("/:id", deleteQuiz);

export default router;
