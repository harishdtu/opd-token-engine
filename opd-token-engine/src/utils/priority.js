const PRIORITY_MAP = {
  EMERGENCY: 1,
  PAID: 2,
  FOLLOW_UP: 3,
  ONLINE: 4,
  WALK_IN: 5
};

function getPriority(source) {
  return PRIORITY_MAP[source];
}

module.exports = { PRIORITY_MAP, getPriority };
