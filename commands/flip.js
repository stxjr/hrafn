const functions = require('../functions.js');

exports.help = 'flip a coin';
exports.usage = '`flip`: flip a coin (heads or tails)';
exports.run = (client, msg, args) => {
  let result;
  if (functions.rand(2) === 1) {
    result = 'heads';
  } else {
    result = 'tails';
  }

  msg.channel.send(result);
  functions.log('coin flipped: landed on ' + result);
};
