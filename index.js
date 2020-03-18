const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();
const server = http.createServer(app);
const socket = socketIO(server);

let currentEvent;
let currentPart;
let currentSlide;

socket.on('connection', (client) => {
  console.log(`[${getDate()}] new client connection: ${client.id}`);
  client.emit('setEvent', currentEvent);
  client.emit('setPart', currentPart);
  client.emit('setSlide', currentSlide);

  client.on('setEvent', (event) => {
    currentEvent = event;
    socket.emit('setEvent', event);
  });
  client.on('setPart', (part) => {
    currentPart = part;
    socket.emit('setPart', part)
  });
  client.on('setSlide', (slide) => {
    currentSlide = slide;
    socket.emit('setSlide', slide)
  });
});

server.listen(port, () => {
  console.log(`[${getDate()}] socket-server started on: localhost:${port}`);
});

function getDate() {
  return new Date().toJSON().slice(0,10).replace(/-/g,'/');
}