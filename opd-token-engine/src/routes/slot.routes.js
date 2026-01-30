const express = require("express");
const router = express.Router();
const { slots } = require("../data/store");

router.get("/:slotId", (req, res) => {
  res.json(slots[req.params.slotId]);
});

module.exports = router;
