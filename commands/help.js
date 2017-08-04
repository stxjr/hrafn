const Discord = require('discord.js');
const fs = require('fs');

const functions = require('../functions.js');

const config = require('../json/config.json');

exports.help = 'show this help message';
exports.usage = 'help';
exports.run = (client, msg, args) => {
  fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);

    var embed = new Discord.RichEmbed()
        // .setAuthor('command list:')
        // .setDescription('⁣ ') // non-breaking space (U+00A0) for padding
        .setColor(0x458588)
        .setFooter('to view admin commands, type ' + config.adminPrefix + 'help', '');

    files.forEach(file => {
      let command = require('./' + file);
      embed.addField('`' + config.commonPrefix + command.usage + '`', command.help);
    });

    msg.channel.send({embed});
  });
};
