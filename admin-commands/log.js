const fs = require('fs');

const functions = require('../functions.js');

exports.help = 'print out hrafn\'s log';
exports.usage = '`log [n]`: print out n (default 10) lines of log';
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
