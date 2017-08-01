var moment = require('moment');
var fs = require('fs');

// how do dice even work (idk, must be hard)
exports.rand = (sides) => {
  return Math.floor((Math.random() * sides)) + 1;
};

exports.formatUptime = (seconds) => {
  function pad (s) {
    return (s < 10 ? '0' : '') + s;
  }
  var days = Math.floor(seconds / (60 * 60 * 24));
  var hours = Math.floor(seconds % (60 * 60 * 24) / (60 * 60));
  var minutes = Math.floor(seconds % (60 * 60) / 60);
  var seconds = Math.floor(seconds % 60);

  return (days > 0 ? pad(days) + 'd ' : '') +
         (hours > 0 ? pad(hours) + 'h ' : '') +
         (minutes > 0 ? pad(minutes) + 'm ' : '') +
         pad(seconds) + 's';
};

// format events for logging
exports.log = (info, msg) => {
  var date = moment().format('YYYY-MM-DD hh:mm:ss');
  var output;

  if (msg) {
    let name = msg.author.username;
    let location = msg.guild
      ? msg.guild.name + '#' + msg.channel.name
      : 'not in guild';
    output = '[log] ' + date + ' [' + location + '] [' + name + '] ' + info;
  } else {
    output = '[log] ' + date + ' ' + info;
  }

  fs.appendFile('hrafn.log', output + '\n', (err) => {
    if (err) throw err;
  });

  console.log(output);
};
