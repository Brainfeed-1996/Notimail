import express from "express";
import cors from "cors";

import Session from "../session.js";
import authentificate from "./authentificate.js";
import list_users from "./list_users.js";
import create_user from "./create_user.js";
import delete_user from "./delete_user.js";
import update_user from "./update_user.js";
import get_user from "./get_user.js";
import disconnect from "./disconnect.js";

let router = express.Router();

router.use(cors())

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use((req, _res, next) => {
  req.session = new Session(req);
  next();
});

router.use(authentificate);
router.use(list_users);
router.use(create_user);
router.use(delete_user);
router.use(update_user);
router.use(get_user);
router.use(disconnect);

export default router;
