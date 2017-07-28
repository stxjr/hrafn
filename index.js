#!/usr/bin/node

const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');

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

  const args = msg.content.split(/\s+/g);
  const command = args.shift().slice(config.adminPrefix.length).toLowerCase();

  try {
    let commandFile = require(`./admin-commands/${command}.js`);
    commandFile.run(client, msg, args);
  } catch (err) {
    functions.log(err);
  }
});

// log in
client.login(config.token);
