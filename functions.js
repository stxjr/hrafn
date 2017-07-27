var moment = require('moment');
var fs = require('fs');

// how do dice even work (idk, must be hard)
exports.rand = (sides) => {
  return Math.floor((Math.random() * sides)) + 1;
};

// format events for logging
exports.log = (info, msg) => {
  var date = moment().format('DD-MM-YY hh:mm:ss');
  var output;

  if (msg) {
    let name = msg.author.username;
    let location = msg.guild
      ? msg.guild.name + '#' + msg.channel.name
      : 'not in guild';
    output = '[log] ' + date + ' [' + location + '] ' + name + ': ' + info;
  } else {
    output = '[log] ' + date + ' ' + info;
  }

  fs.appendFile('hrafn.log', output + '\n', (err) => {
    if (err) throw err;
  });

  console.log(output);
};
