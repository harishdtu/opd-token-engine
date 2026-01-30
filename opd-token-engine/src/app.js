const express = require("express");

const tokenRoutes = require("./routes/token.routes");
const slotRoutes = require("./routes/slot.routes");
const simulateRoutes = require("./routes/simulate.routes");

const app = express();
app.use(express.json());

app.use("/tokens", tokenRoutes);
app.use("/slots", slotRoutes);
app.use("/simulate", simulateRoutes);

module.exports = app;
