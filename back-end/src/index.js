import express from "express";
import "dotenv/config";

import routes from "./routes/index.js";
import { PORT } from "./environment.js";

let http_server = express();

http_server.use("/", routes);

http_server.listen(PORT, () => {
  console.log("Http server listening on port " + PORT);
});
