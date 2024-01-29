import { Router } from "express";
import controller from "../controller/index.js";
import PermissionException from "../controller/permission_exception.js";

export default Router().put("/update_user", async (req, res) => {
  try {
    const {
      firm_name,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      has_mail,
      is_admin,
    } = req.body;

    if (
      typeof firm_name != "string" ||
      (typeof first_name != "string" && first_name != undefined) ||
      (typeof last_name != "string" && last_name != undefined) ||
      (typeof email != "string" && email != undefined) ||
      (typeof phone_number != "string" && phone_number != undefined) ||
      (typeof password != "string" && password != undefined) ||
      (typeof has_mail != "boolean" && has_mail != undefined) ||
      (typeof is_admin != "boolean" && is_admin != undefined)
    ) {
      res.sendStatus(400);
      return;
    }

    if (await controller.updateUser(
      req.session,
      firm_name,
      first_name,
      last_name,
      email,
      phone_number,
      password,
      has_mail,
      is_admin
    )) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    if (err instanceof PermissionException) {
      res.sendStatus(401);
      return;
    }

    console.log("Error: " + err.stack);
    res.sendStatus(500);
  }
});

