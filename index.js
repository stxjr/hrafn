#!/usr/bin/node
// TODO
// fix canUse
// make music have features

const Discord = require('discord.js');
var moment = require('moment');
var fs = require('fs');

const poll = require('./poll.js'); // handles polls
const config = require('./config.json'); // get config from config.js
const games = require('./misc/games.json');

const client = new Discord.Client();

//
// functions
//

// how do dice even work (idk, must be hard)
function rand (sides) {
  return Math.ceil((Math.random() * sides));
}

// function canUse (msg) {
//    var can = Date.now() - msg.createdTimestamp > 50;
//    if (can) {
//    return true;
//    } else {
//      msg.author.reply('no');
//      return false;
//    }
//
//   console.log(msg.createdTimestamp);
//   console.log(Math.floor(Date.now()));
//   console.log(Math.floor((Date.now() - msg.createdTimestamp) / 1000));
// }

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

  fs.appendFile('hrafn.log', output + '\n', function (err) {
    if (err) throw err;
  });

  console.log(output);
}

client.on('ready', () => {
  log('all systems online'); // idk sounds cool
  var currentGame = games[Math.floor(Math.random() * (games.length))]; // don't replace with rand();
  client.user.setGame(currentGame);
  log('playing: ' + currentGame);
});

// help
client.on('message', msg => {
  if (msg.content.match(/^help$/i)) {
    log('help given', msg);
  }
});

// ping pong
client.on('message', msg => {
  if (msg.content.match(/^ping$/i)) {
    msg.channel.send(msg.content.replace('i', 'o').replace('I', 'O'));
    log('ping', msg);
  }
});

// get the id of a channel
client.on('message', msg => {
  if (msg.content.match(/^id$/i)) {
    msg.channel.send(msg.channel.id);
    log('id of channel given', msg);
  }
});

// output last 10 lines of log
client.on('message', msg => {
  if (msg.content.match(/^log( \d*)?$/i)) {
    var lines = msg.content.replace(/[^0-9]/g, '') || 10;
    fs.readFile('hrafn.log', function (err, data) {
      if (err) throw err;
      var output = data.toString().split('\n').slice(-(lines)).join('\n');
      msg.channel.send('```\n' + output + '\n```');
    });
    log('last ' + 10 + ' lines of log given', msg);
  }
});

// swear filter
client.on('message', msg => {
  if (msg.content.match(/bazinga/i)) {
    var tempmsg = msg;
    msg.delete();
    tempmsg.reply('http://imgh.us/swe.jpg');
    log('swear filtered', msg);
  }
});

// roll a die
// usage: roll [sides]
client.on('message', msg => {
  if (msg.content.match(/^roll(\s*\d*)?$/i)) {
    const args = msg.content.split(/\s+/g);
    var sides = args[1] || 6;
    var result = rand(sides);
    msg.channel.send(result);
    log('die rolled: ' + result + ' out of ' + sides, msg);
  }
});

// allegedly...
client.on('message', msg => {
  if (rand(120) === 120) {
    msg.channel.send('*allegedly...*');
    log('allegedly, rng', msg);
  }
});

// join a voice channel
// TODO: fix this
client.on('message', msg => {
  if (msg.content.match(/^join$/i)) {
    // check if user is in a channel
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join()
      .then(connection => { // Connection is an instance of VoiceConnection
        msg.reply('I have successfully connected to the channel!');
      })
      .then(dispatcher => {
        dispatcher.on('error', msg.reply('__**Uh oh!**__ \nyou need to be in a voice channel'));
      })
      .catch(msg.reply('__**Uh oh!**__ \nyou need to be in a voice channel'));
    }
  }
});

// preston's playhouse
// enter if you dare

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
