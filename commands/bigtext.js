const functions = require('../functions.js');

exports.help = 'make text big';
exports.usage = '`bigtext [text]`: make text big';
exports.run = (client, msg, args) => {
  let result = '';

  var numbers = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine'
  };

  args.join(' ').split('').forEach((char) => {
    if (char.match(/[a-z]/i)) {
      result += ':regional_indicator_' + char + ':';
    } else if (char.match(/[0-9]/i)) {
      result += ':' + numbers[char] + ':';
    } else if (char == ' ') {
      result += '          ';
    }
  });
  msg.channel.send(result);

  functions.log('regionified [' + args.join(' ') + ']');
};
