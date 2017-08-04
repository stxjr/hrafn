const fs = require('fs');

const functions = require('../functions.js');

exports.help = 'print out n lines of log (default 10)';
exports.usage = 'log [n]';
exports.run = (client, msg, args) => {
  var lines = args[0] || 10;
  fs.readFile('hrafn.log', (err, data) => {
    if (err) throw err;
    var output = data
      .toString()
      .replace(/\n$/, '') // remove trailing \n
      .split('\n')
      .slice(-(lines))
      .join('\n');
    msg.channel.send('```\n' + output + '\n```');
  });
  functions.log('last ' + lines + ' lines of log given', msg);
};
