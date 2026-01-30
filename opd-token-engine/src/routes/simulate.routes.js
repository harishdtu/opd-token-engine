const express = require("express");
const router = express.Router();
const { allocateToken } = require("../services/allocation.service");
const { tokens } = require("../data/store");

router.post("/day", (req, res) => {
  const timeline = [];

  timeline.push({
    time: "09:00",
    event: "Online booking",
    result: allocateToken({
      patientId: "P1",
      slotId: "D1-09",
      source: "ONLINE"
    })
  });

  timeline.push({
    time: "09:05",
    event: "Walk-in patient",
    result: allocateToken({
      patientId: "P2",
      slotId: "D1-09",
      source: "WALK_IN"
    })
  });

  timeline.push({
    time: "09:10",
    event: "Paid priority patient",
    result: allocateToken({
      patientId: "P3",
      slotId: "D1-09",
      source: "PAID"
    })
  });

  timeline.push({
    time: "09:20",
    event: "Emergency arrival",
    result: allocateToken({
      patientId: "P4",
      slotId: "D1-09",
      source: "EMERGENCY"
    })
  });

  const noShowToken = Object.values(tokens).find(
    t => t.patientId === "P1"
  );

  timeline.push({
    time: "09:40",
    event: "No-show detected for P1",
    tokenId: noShowToken?.tokenId
  });

  res.json({
    message: "OPD Day Simulation Completed",
    timeline
  });
});

module.exports = router;
