const Discord = require('discord.js');
var live = false;

exports.createPoll = function (message) {
  console.log('create');
  live = true;
};

exports.endPoll = function (message) {
  console.log('end');
  live = false;
};

exports.isLive = function (message) {
  return live;
};
