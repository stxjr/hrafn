const Discord = require('discord.js');
var live = false;
var data = {
  author: "",
  options: [],
  votes: []
};

exports.createPoll = function (msg) {
  console.log('create');
  live = true;
  msg.author.send('Hello, I am here to help you create a poll!');
};

exports.endPoll = function (msg) {
  console.log('end');
  live = false;
};

exports.isLive = function (msg) {
  return live;
};
