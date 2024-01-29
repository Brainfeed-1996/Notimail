import { Router } from "express";

import controller from "../controller/index.js";
import PermissionException from "../controller/permission_exception.js";

export default Router().get("/get_user/:firm_name", async (req, res) => {
  try {
    const { firm_name } = req.params;

    if (typeof firm_name != "string") {
      res.sendStatus(400);
      return;
    }

    const user = await controller.getUser(req.session, firm_name);
    if (user == null) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  } catch (err) {
    if (err instanceof PermissionException) {
      res.sendStatus(401);
      return;
    }

    console.error("Error : " + err.stack);
    res.sendStatus(500);
  }
});

