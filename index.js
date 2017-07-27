#!/usr/bin/node

const Discord = require('discord.js');
var moment = require('moment');
var fs = require('fs');

const functions = require('./functions.js');
const poll = require('./poll.js'); // handles polls
const config = require('./json/config.json'); // get config from config.js
const games = require('./json/games.json');
const responses = require('./json/responses.json');
const reactions = require('./json/reactions.json');

const client = new Discord.Client();

// handle errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));

// run on startup
client.on('ready', () => {
  functions.log('all systems online');
  var currentGame = games[functions.rand(games.length) - 1];
  client.user.setGame(currentGame);
  functions.log('playing: ' + currentGame);
});

// things that trigger without a command
client.on('message', msg => {
  if (msg.author.bot) return;

  var input = msg.content;

  // loop through responses
  for (let key in responses) {
    let regex = new RegExp('\\b' + key + '\\b');
    if (input.toLowerCase().match(regex)) {
      msg.channel.send(responses[key]);
      functions.log('responded to "' + key + '" with "' + responses[key] + '"', msg);
    }
  }

  // loop through reactions
  for (let key in reactions) {
    if (input.includes(key)) {
      msg.react(reactions[key]);
      functions.log('reacted to "' + key + '" with "' + reactions[key] + '"', msg);
    }
  }

  // allegedly...
  // d120 in honor of walter
  if (functions.rand(120) === 120) {
    msg.channel.send('*allegedly...*');
    functions.log('allegedly triggered', msg);
  }

  // swear filter
  if (input.includes('bazinga')) {
    msg.reply('http://imgh.us/swe.jpg');
    msg.delete();
    functions.log('swear filtered', msg);
  }
});

// common (plebian) commands
client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.commonPrefix)) return;

  const args = msg.content.split(/\s+/g);
  const command = args.shift().slice(config.commonPrefix.length).toLowerCase();

  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, msg, args);
  } catch (err) {
    functions.log(err);
  }

  // TODO: info message
  if (args[0] === 'info') {
    // TODO: show prefix, uptime, creator
    // functions.log('info message given', msg);
  }

  // preston's playhouse
  // enter if you dare

  // Event trigger for poll management

  if (args[0] === 'poll') {
    if (args.length < 2) {
      msg.channel.send('__**Uh oh!**__ \nI don\'t understand! Try these commands to help you\n`poll help || poll [option]`');
      return;
    }
    switch (args[1]) {
      case 'create':
        if (!poll.isLive()) {
          poll.createPoll(msg);
        } else {
          msg.channel.send('__**Uh oh!**__\nA poll is aleady in progress. Please end that poll to create a new one.');
        }
        break;
      case 'end':
        if (poll.isLive()) {
          poll.endPoll(msg);
        } else {
          msg.channel.send('__**Uh oh!**__\nThere is not an active poll to close. You can use:\n`poll create`\n to create a new poll');
        }
    }
  }
});

// admin-only commands
client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.adminPrefix)) return;
  if (!msg.member.roles.has(config.adminRoleId)) {
    msg.reply('you don\'t have the right permissions to do that');
    return;
  }

  var args = msg.content.slice(1).split(/\s+/g);

  // get id of channel
  if (args[0] === 'id') {
    msg.channel.send(msg.channel.id);
    functions.log('id of channel given', msg);
  }

  // output last (n || 10) lines of log
  if (args[0] === 'log') {
    var lines = args[1] || 10;
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
  }

  // something something don't mention people
  const clean = text => {
    if (typeof (text) === 'string') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    } else {
      return text;
    }
  };

  if (args[0] === 'eval') {
    try {
      const code = args.slice(1).join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string') {
        evaled = require('functions').inspect(evaled);
      }

      msg.channel.send(clean(evaled), {code: 'xl'});
      functions.log('evaluated [' + code + '] with result: [' + evaled + ']', msg);
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      functions.log('error on eval: ' + err);
    }
  }
});

// log in
client.login(config.token);
