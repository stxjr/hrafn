const Discord = require('discord.js');
const fs = require('fs');

const functions = require('../functions.js');

const config = require('../json/config.json');

exports.help = 'show this help message';
exports.usage = 'help';
exports.run = (client, msg, args) => {
  fs.readdir('./admin-commands/', (err, files) => {
    if (err) return console.error(err);

    var embed = new Discord.RichEmbed()
        .setColor(0x458588)
        .setFooter('to view common commands, type ' + config.commonPrefix + 'help', '');

    files.forEach(file => {
      let command = require('./' + file);
      embed.addField('`' + config.adminPrefix + command.usage + '`', command.help);
    });

    msg.channel.send({embed});
  });
};
