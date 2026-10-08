import { Router } from "express";
import { login, register, getUserHistory, addToHistory } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/get_all_activity").get(getUserHistory);
router.route("/add_to_activity").post(addToHistory);

export default router;
