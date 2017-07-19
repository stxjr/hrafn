#!/usr/bin/node

const Discord = require('discord.js');
var moment = require('moment');
var fs = require('fs');

const poll = require('./poll.js'); // handles polls
const config = require('./config.json'); // get config from config.js
const games = require('./games.json');
const responses = require('./responses.json');
const reactions = require('./reactions.json');

const client = new Discord.Client();

// functions

// how do dice even work (idk, must be hard)
function rand (sides) {
  return Math.floor((Math.random() * sides)) + 1;
}

// format events for logging
function log (info, msg) {
  var date = moment().format('DD-MM-YY hh:mm:ss');
  var output;

  if (msg) {
    var name = msg.author.username;
    var location = msg.guild
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
}

// handle errors
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));

// run on startup
client.on('ready', () => {
  log('------------------');
  log('all systems online');
  var currentGame = games[rand(games.length) - 1];
  // don't replace with rand();
  client.user.setGame(currentGame);
  log('playing: ' + currentGame);
});

// commands
client.on('message', msg => {
  if (msg.author.bot) return;

  var input = msg.content.toLowerCase();
  var args = msg.content.toLowerCase().split(/\s+/g);

  // TODO: info message
  if (input.match(/^info$/)) {
    msg.channel.send(`
      `);
    log('info message given', msg);
  }

  // TODO: help message
  if (input.match(/^help$/)) {
    msg.channel.send(`

      `);
      // log('help message given', msg);
  }

  // loop through responses
  for (let key in responses) {
    if (input.includes(key)) {
      msg.channel.send(responses[key]);
      log('responded to "' + key + '" with "' + responses[key] + '"', msg);
    }
  }

  // loop through reactions
  for (let key in reactions) {
    if (input.includes(key)) {
      msg.react(reactions[key]);
      log('reacted to "' + key + '" with "' + reactions[key] + '"', msg);
    }
  }

  // get id of channel
  if (args[0] === 'id') {
    msg.channel.send(msg.channel.id);
    log('id of channel given', msg);
  }

  // output last 10 lines of log
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
    log('last ' + lines + ' lines of log given', msg);
  }

  // swear filter
  if (input.includes('bazinga')) {
    var tempmsg = msg;
    msg.delete();
    tempmsg.reply('http://imgh.us/swe.jpg');
    log('swear filtered', msg);
  }

  // roll a die
  // usage: roll [sides]
  if (args[0] === 'roll') {
    var sides = args[1] || 6;
    var result = rand(sides);

    msg.channel.send(result);
    log('die rolled: ' + result + ' out of ' + sides, msg);
  }

  // allegedly...
  if (rand(120) === 120) {
    msg.channel.send('*allegedly...*');
    log('allegedly triggered', msg);
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
  if (!msg.member.roles.has(config.adminRoleId)) return;

  var input = msg.content.toLowerCase();
  var args = msg.content.toLowerCase().split(/\s+/g);

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
        evaled = require('util').inspect(evaled);
      }

      msg.channel.send(clean(evaled), {code: 'xl'});
      log('evaluated [' + code + '] with result: [' + evaled + ']', msg);
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      log('error on eval: ' + err);
    }
  }
});

// log in
client.login(config.token);
