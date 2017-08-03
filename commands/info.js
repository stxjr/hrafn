const fs = require('fs');
const moment = require('moment');

const functions = require('../functions.js');

const config = require('../json/config.json');

exports.help = 'show information about the bot';
exports.usage = '`info`: show information about the bot';
exports.run = (client, msg, args) => {
  botUptime = functions.formatUptime(process.uptime());

  msg.channel.send(`
uptime: ${botUptime}
prefix: ${config.commonPrefix}
admin prefix: ${config.adminPrefix}`, {code: ''});

  functions.log('info message given', msg);
};
