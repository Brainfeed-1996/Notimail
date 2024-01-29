import { Router } from "express";

import controller from "../controller/index.js";

export default Router().post("/authentificate", async (req, res) => {
  try {
    const {
      firm_name,
      password,
    } = req.body;

    if (typeof firm_name != "string" || typeof password != "string") {
      res.sendStatus(400);
      return;
    }
    
    let token = await controller.authentificate(firm_name, password);
    if (token == null) {
      res.sendStatus(401);
      return;
    }

    res.status(200).send({ token: token });
  } catch (err) {
    console.error("Error: " + err.stack);
    res.sendStatus(500);
  }
});
