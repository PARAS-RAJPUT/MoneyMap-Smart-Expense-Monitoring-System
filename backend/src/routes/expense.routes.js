import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense
} from "../controllers/expense.controller.js";

const router = Router();

router.use(auth);
router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
