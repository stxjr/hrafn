const fs = require('fs');

const functions = require('../functions.js');

exports.help = 'show this help message';
exports.usage = '`help`: show a helpful help message';
exports.run = (client, msg, args) => {
  if (!args[0]) { // full help message
    fs.readdir('./admin-commands/', (err, files) => {
      if (err) return console.error(err);

      var helpMessage = 'here are the available admin commands:```xl\n';

      files.forEach(file => {
        let command = require('./' + file);
        let commandName = file.split('.')[0];
        helpMessage += ('\n' + commandName + ' : ' + command.help);
      });

      helpMessage += '```';

      msg.channel.send(helpMessage);
    });
  }

  if (args[0]) {
    fs.readdir('./admin-commands/', (err, files) => {
      if (err) return console.error(err);

      if (files.indexOf(args[0] + '.js') > -1) { // if array contains
        let command = require('./' + args[0] + '.js');
        msg.channel.send(command.usage);
      } else {
        msg.channel.send('"' + args[0] + '" is not a valid command');
      }
    });
  }

  // !help -> command.help
  // !help [command] -> command.usage
  // functions.log('help message given', msg);
};
