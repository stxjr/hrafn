const Discord = require('discord.js');
var live = false;

exports.createPoll = function(mesasge){
  console.log('create');
  live = true;
}

exports.endPoll = function(message){
  console.log('end');
  live = false;
}

exports.isLive = function(message){
  return live;
}
