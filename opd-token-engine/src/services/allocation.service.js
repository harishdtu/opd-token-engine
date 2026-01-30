const { v4: uuid } = require("uuid");
const { slots, tokens, waitlist } = require("../data/store");
const { getPriority } = require("../utils/priority");

function allocateToken({ patientId, slotId, source }) {
  const slot = slots[slotId];
  if (!slot) return { error: "Invalid slot" };

  const newToken = {
    tokenId: uuid(),
    patientId,
    slotId,
    source,
    priority: getPriority(source),
    status: "ACTIVE"
  };

  // Case 1: capacity available
  if (slot.tokens.length < slot.capacity) {
    slot.tokens.push(newToken);
    tokens[newToken.tokenId] = newToken;
    return { success: true, token: newToken };
  }

  // Case 2: Emergency always allowed
  if (source === "EMERGENCY") {
    slot.tokens.push(newToken);
    slot.overbooked = true;
    tokens[newToken.tokenId] = newToken;
    return { success: true, token: newToken, overbooked: true };
  }

  // Case 3: Try to bump lowest priority
  let lowest = slot.tokens.reduce((a, b) =>
    a.priority > b.priority ? a : b
  );

  if (newToken.priority < lowest.priority) {
    // bump
    slot.tokens = slot.tokens.filter(t => t.tokenId !== lowest.tokenId);
    lowest.status = "BUMPED";

    slot.tokens.push(newToken);
    tokens[newToken.tokenId] = newToken;

    // add bumped to waitlist
    waitlist[slotId] = waitlist[slotId] || [];
    waitlist[slotId].push(lowest);

    return { success: true, token: newToken, bumped: lowest };
  }

  // Case 4: reject → waitlist
  waitlist[slotId] = waitlist[slotId] || [];
  waitlist[slotId].push(newToken);

  return { success: false, reason: "Slot full, added to waitlist" };
}

module.exports = { allocateToken };
