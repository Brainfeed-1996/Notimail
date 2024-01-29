import { Router } from "express";

import controller from "../controller/index.js"

export default Router().get("/list_users", async (_req, res) => {
  try {
    res.status(200).json(await controller.listUsers());
  } catch (err) {
    console.error("Error: " + err.stack);
    res.sendStatus(500);
  }
});

