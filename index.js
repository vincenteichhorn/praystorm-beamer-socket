const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);
const socket = socketIO(server);


let state = {
  currentEvent: undefined,
  currentPart: undefined,
  currentSlide: undefined,
  hide: false,
  hideForeground: false,
  adjustment: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  }
}


socket.on('connection', (client) => {
  console.log(`[Info] new client connection: ${client.id}`);
  client.emit('setEvent', state.currentEvent);
  client.emit('setPart', state.currentPart);
  client.emit('setSlide', state.currentSlide);
  client.emit('setAdjustment', state.adjustment);
  client.emit('blackout', state.hide);
  client.emit('blackoutForeground', state.hideForeground);

  client.on('setEvent', (event) => {
    state.currentEvent = event;
    socket.emit('setEvent', event);
    logState('setEvent');
  });
  client.on('setPart', (part) => {
    state.currentPart = part;
    socket.emit('setPart', part);
    logState('setPart');
  });
  client.on('setSlide', (slide) => {
    state.currentSlide = slide;
    socket.emit('setSlide', slide);
    logState('setSlide');
  });
  client.on('blackout', (hide) => {
    state.hide = hide;
    socket.emit('blackout', hide);
    logState('blackout');
  });
  client.on('blackoutForeground', (hideForeground) => {
    state.hideForeground = hideForeground;
    socket.emit('blackoutForeground', hideForeground);
    logState('blackoutForeground');
  });
  client.on('setAdjustment', (adjustment) => {
    state.adjustment = adjustment;
    socket.emit('setAdjustment', adjustment);
    logState('setAdjustment');
  })
});

server.listen(port, () => {
  console.log(`[Info] socket-server started on: localhost:${port}`);
});

function logState(event) {
  console.log(`[StateChanged] ${event}`);
  //console.log(JSON.stringify(state, null, 2));
}