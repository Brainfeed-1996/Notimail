import { Router } from "express";

import controller from "../controller/index.js";
import PermissionException from "../controller/permission_exception.js";

export default Router().post("/create_user", async (req, res) => {
  try {
    const {
      firm_name,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      is_admin,
    } = req.body;

    if (
      typeof firm_name != "string" ||
      typeof first_name != "string" ||
      typeof last_name != "string" ||
      typeof email != "string" ||
      typeof phone_number != "string" ||
      typeof password != "string" ||
      typeof is_admin != "boolean"
    ) {
      res.sendStatus(400);
      return;
    }

    if (await controller.createUser(
      req.session,
      firm_name,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      is_admin,
    )) {
    res.sendStatus(201);
      
    } else {
      res.sendStatus(409);
    }

  } catch (err) {
    if (err instanceof PermissionException) {
      res.sendStatus(401);
      return;
    }

    console.error("Error : " + err.stack);
    res.sendStatus(500);
  }
});

