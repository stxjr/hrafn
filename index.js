#!/usr/bin/node

// import the discord.js module
const Discord = require('discord.js');
const client = new Discord.Client();
const poll = require('./poll.js'); // handles polls

const config = require('./config.json'); // get config from config.js

//
// functions
//

// how do dice even work (idk, must be hard)
function rand (sides) {
  return Math.ceil((Math.random() * sides));
}

function canUse (author) {
  var can = Date.now() - author.lastMessage.createdTimestamp > 50;
  if (can) {
    return true;
  } else {
    author.lastMessage.reply('no');
    return false;
  }
}

client.on('ready', () => {
  console.log('ready');
});

// help
client.on('message', msg => {
  if (msg.content.match(/^help$/i)) {
    msg.channel.send('here are the commands available:\n' +
      '\tping: type ping to get a pong\n' +
      '\troll [n]: Type roll [n] to roll a die with n sides (defaults to 6)');
  }
});

// ping pong
client.on('message', msg => {
  if (msg.content.match(/^ping$/i) && canUse(msg.author)) {
    msg.channel.send(msg.content.replace('i', 'o').replace('I', 'O'));
  }
});

// get the id of a channel
client.on('message', msg => {
  if (msg.content.match(/^id$/i)) {
    msg.channel.send(msg.channel.id);
  }
});

// swear filter
client.on('message', msg => {
  if (msg.content.match(/bazinga/i)) {
    var tempmsg = msg;
    msg.delete();
    tempmsg.reply('http://imgh.us/swe.jpg');
  }
});

// roll a die
// usage: roll [sides]
client.on('message', msg => {
  if (msg.content.match(/^roll( \d*)?$/i) && canUse(msg.author)) {
    var sides = msg.content.replace(/[^0-9]/g, '');
    if (sides === '') {
      sides = 6;
    }
    var result = rand(sides);
    msg.channel.send(result);
    console.log('die rolled: ' + result + ' out of ' + sides);
  }
});

// allegedly...
client.on('message', msg => {
  if (rand(120) === 120) {
    msg.channel.send('*allegedly...*');
    console.log('allegedly...');
  }
});

// join a voice channel
client.on('message', msg => {
  if (msg.content.match(/^join$/i)) {
    // check if user is in a channel
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join()
      .then(connection => { // Connection is an instance of VoiceConnection
        msg.reply('I have successfully connected to the channel!');
      })
      .catch(console.log);
    } else {
      msg.reply('You need to join a voice channel first!');
    }
  }
});

// Event trigger for poll management
client.on('message', msg => {
  var args = msg.content.split(' ');

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

// log in
client.login(config.token);
