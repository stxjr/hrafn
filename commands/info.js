const fs = require('fs');
const moment = require('moment');

const functions = require('../functions.js');

exports.help = 'show information about the bot';
exports.usage = '`info`: show information about the bot';
exports.run = (client, msg, args) => {
  botUptime = functions.formatUptime(process.uptime());
  msg.channel.send('`bot uptime: ' + botUptime + '`');
  // functions.log('', msg);
};
