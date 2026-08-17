'use strict';

const { port, host } = require('./config');
const server = require('./bootstrap/server');

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`Neutral platform server listening on http://${host}:${port}`);
  });
}

module.exports = server;
