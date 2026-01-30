const express = require("express");
const router = express.Router();
const { allocateToken } = require("../services/allocation.service");
const { tokens, slots, waitlist } = require("../data/store");

// Create token
router.post("/", (req, res) => {
  const result = allocateToken(req.body);
  res.json(result);
});

// Cancel token
router.post("/:id/cancel", (req, res) => {
  const token = tokens[req.params.id];
  if (!token) return res.status(404).json({ error: "Token not found" });

  token.status = "CANCELLED";

  const slot = slots[token.slotId];
  slot.tokens = slot.tokens.filter(t => t.tokenId !== token.tokenId);

  // Pull from waitlist
  if (waitlist[token.slotId]?.length) {
    const next = waitlist[token.slotId].shift();
    next.status = "ACTIVE";
    slot.tokens.push(next);
  }

  res.json({ success: true });
});
// Mark no-show
router.post("/:id/no-show", (req, res) => {
  const token = tokens[req.params.id];
  if (!token) {
    return res.status(404).json({ error: "Token not found" });
  }

  if (token.status !== "ACTIVE") {
    return res.status(400).json({ error: "Token not active" });
  }

  token.status = "NO_SHOW";

  const slot = slots[token.slotId];
  slot.tokens = slot.tokens.filter(t => t.tokenId !== token.tokenId);

  // Reallocate from waitlist
  if (waitlist[token.slotId]?.length) {
    const next = waitlist[token.slotId].shift();
    next.status = "ACTIVE";
    slot.tokens.push(next);
  }

  res.json({
    success: true,
    message: "Token marked as no-show and slot reallocated"
  });
});

module.exports = router;
