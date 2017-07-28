const fs = require('fs');

const functions = require('../functions.js');

exports.help = 'evalate a piece of code';
exports.usage = '`eval`: evaluate a piece of code';
exports.run = (client, msg, args) => {
  // something something don't mention people
  const clean = text => {
    if (typeof (text) === 'string') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
      return text;
    }
  };

  try {
    const code = args.join(' ');
    let evaled = eval(code);

    if (typeof evaled !== 'string') {
      evaled = require('util').inspect(evaled);
    }
    if (evaled.length >= 2000) {
      msg.channel.send('error: output is over 2000 characters');
      functions.log('evaluated [' + code + ']; output was over 2000 characters', msg);
    } else {
      msg.channel.send(clean(evaled), {code: 'js'});
      functions.log('evaluated [' + code + '] with result: [' + evaled + ']', msg);
    }
  } catch (err) {
    msg.channel.send(`\`ERROR\` \`\`\`xl1\n${clean(err)}\n\`\`\``);
    functions.log('error on eval: ' + err);
  }
};
