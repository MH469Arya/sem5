const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Hello world from CI/CD pipeline!"));
app.listen(3000, () => console.log("Running on 3000"));