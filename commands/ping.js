const Discord = require('discord.js');

const functions = require('../functions.js');

exports.help = 'you get a pong, *you* get a pong, **you** get a pong';
exports.usage = 'ping';
exports.run = (client, msg, args) => {
  msg.channel.send(`pong. \`${Date.now() - msg.createdAt}\` ms`);
  functions.log('die rolled: ' + result + ' out of ' + sides, msg);
};
