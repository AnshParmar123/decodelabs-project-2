/**
 * Minimal hand-rolled CORS handling — no dependency needed for a single
 * allowed-origin, small-method API. Lets the Project 1 frontend (served
 * from a different origin/port) call this API from the browser.
 */
function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
}

module.exports = cors;
