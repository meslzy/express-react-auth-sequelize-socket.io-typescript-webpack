import {Router} from "express";

import * as controls from "./controls/users.control";
import * as validate from "./validate/users.validate";

const router = Router();

router.get("/user/", validate.token, controls.user);

router.post("/user/sign-in/", validate.sign_in, controls.sign_in);
router.post("/user/sign-up/", validate.sign_up, controls.sign_up);

router.post("/user/token/create", controls.token_create);
router.post("/user/token/refresh", controls.token_refresh);

export default router;
