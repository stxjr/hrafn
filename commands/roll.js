const functions = require('../functions.js');

exports.help = 'roll a die';
exports.usage = '`roll [n]`: roll a die with n sides';
exports.run = (client, msg, args) => {
  let sides = args[0] || 6;
  let result = functions.rand(sides);

  msg.channel.send(result);
  functions.log('die rolled: ' + result + ' out of ' + sides, msg);
};
