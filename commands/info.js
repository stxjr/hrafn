const fs = require('fs');

const functions = require('../functions.js');

exports.help = 'show information about the bot';
exports.usage = '`info`: show information about the bot';
exports.run = (client, msg, args) => {
  msg.channel.send('wip');
  // functions.log('', msg);
};
