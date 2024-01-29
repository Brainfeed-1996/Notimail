import { Router } from "express";

import controller from "../controller/index.js"
import PermissionException from "../controller/permission_exception.js";

export default Router().post("/disconnect", async (req, res) => {
  try {
    await controller.disconnect(req.session);
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof PermissionException) {
      res.sendStatus(401);
      return;
    }

    console.error("Error: " + err.stack);
    res.sendStatus(500);
  }
});

