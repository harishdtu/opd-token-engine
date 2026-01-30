const doctors = {};
const slots = {};
const tokens = {};
const waitlist = {};

module.exports = {
  doctors,
  slots,
  tokens,
  waitlist
};
const { v4: uuid } = require("uuid");

function initData() {
  const doctorIds = ["D1", "D2", "D3"];

  doctorIds.forEach((id) => {
    const slot1 = `${id}-09`;
    const slot2 = `${id}-10`;

    slots[slot1] = {
      slotId: slot1,
      doctorId: id,
      start: "09:00",
      end: "10:00",
      capacity: 5,
      tokens: [],
      overbooked: false
    };

    slots[slot2] = {
      slotId: slot2,
      doctorId: id,
      start: "10:00",
      end: "11:00",
      capacity: 5,
      tokens: [],
      overbooked: false
    };
  });
}

initData();
