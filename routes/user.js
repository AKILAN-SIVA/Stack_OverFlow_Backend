import express from "express";
import auth from "../middlewares/auth.js";
import { login, signup } from "../controllers/auth.js";
import { getallUsers, updateProfile } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUser", getallUsers);
router.patch("/update/:id", updateProfile);

export default router;