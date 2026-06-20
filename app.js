// Hostinger's "startup file" sometimes defaults to app.js — delegate to server.js.
module.exports = require('./server.js');
