const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');

const functions = require('../functions.js');

const config = require('../json/config.json');

exports.help = 'show information about the bot';
exports.usage = 'info';
exports.run = (client, msg, args) => {
  botUptime = functions.formatUptime(process.uptime());

  msg.channel.send(`
uptime: ${botUptime}
prefix: ${config.commonPrefix}
admin prefix: ${config.adminPrefix}`, {code: ''});

  var embed = new Discord.RichEmbed()
    .addField('Title', 'Description');
  msg.channel.send({embed});

  functions.log('info message given', msg);
};
