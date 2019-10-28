/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import * as express from "express";
import { startServerAsExternalProcess } from "ov-language-server/dist/server-launcher";

startServerAsExternalProcess();

process.on("uncaughtException", (err: any) => {
  console.error("Uncaught Exception: ", err.toString());
  if (err.stack) {
    console.error(err.stack);
  }
});

// create the express application
const app = express();
const EDITOR_PORT = process.env.EDITOR_PORT || 8001;

// server the static content, i.e. index.html
app.use(express.static(__dirname));

// start the server
app.listen(EDITOR_PORT, () =>
  console.log(`Editor is running on http://localhost:${EDITOR_PORT}`)
);
