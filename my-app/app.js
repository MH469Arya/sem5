const express = require("express");
const path    = require("path");

const app = express();

// Serve the calculator SPA
app.use(express.static(path.join(__dirname, "public")));

// Health-check endpoint (useful for k8s liveness/readiness probes)
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(3000, () => console.log("Calculator app running on port 3000"));
