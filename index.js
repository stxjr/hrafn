#!/usr/bin/node

// import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client();
const poll = require('./poll.js'); // handles polls

const config = require('./config.json'); // get token from token.js

client.on('ready', () => {
  console.log('ready');
});

client.on('message', message => {
  if (message.content.match(/^help$/i)) {
    message.channel.send('here are the commands available:\n' +
      '\tping: type ping to get a pong\n' +
      '\troll [n]: Type roll [n] to roll a die with n sides (defaults to 6)');
  }
});

// ping pong
client.on('message', message => {
  if (message.content.match(/^ping$/i)) {
    message.channel.send(message.content.replace('i', 'o').replace('I', 'O'));
  }
});

// get the id of a channel
client.on('message', message => {
  if (message.content.match(/^id$/i) && message.author.id !== 284509390604861452) {
    message.channel.send(message.channel.id);
  }
});

// swear filter
client.on('message', message => {
  if (message.content.match(/bazinga/i)) {
    var tempmessage = message;
    message.delete();
    tempmessage.reply('http://imgh.us/swe.jpg');
  }
});

// how do dice even work (idk, must be hard)
function rand (sides) {
  return Math.ceil((Math.random() * sides));
}

// roll a die
// usage: roll [sides]
client.on('message', message => {
  if (message.content.toLowerCase().match(/^roll( \d*)?$/) && message.author.id !== 284509390604861452) {
    var sides = message.content.replace(/[^0-9]/g, '');
    if (sides === '') {
      sides = 6;
    }
    var result = rand(sides);
    message.channel.send(result);
    console.log('die rolled: ' + result + ' out of ' + sides);
  }
});

// allegedly...
client.on('message', message => {
  if (rand(120) === 120) {
    message.channel.send('*allegedly...*');
    console.log('allegedly...');
  }
});

// Event trigger for poll management
client.on('message', message => {
  var args = message.content.split(' ');

  if (args[0] === 'poll') {
    if (args.length < 2) {
      message.channel.send('__**Uh oh!**__ \nI don\'t understand! Try these commands to help you\n`poll help || poll [option]`');
      return;
    }
    switch (args[1]) {
      case 'create':
        if (!poll.isLive()) {
          poll.createPoll(message);
        } else {
          message.channel.send('__**Uh oh!**__\nA poll is aleady in progress. Please end that poll to create a new one.');
        }
        break;
      case 'end':
        if (poll.isLive()) {
          poll.endPoll(message);
        } else {
          message.channel.send('__**Uh oh!**__\nThere is not an active poll to close. You can use:\n`poll create`\n to create a new poll');
        }
    }
  }
});

// log in
client.login(config.token);
