/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

var Bgpio = Bgpio || {};
Bgpio.WebSocket = {};

Bgpio.WebSocket.ws = null;
Bgpio.WebSocket.URL = 'ws://localhost:8000/';

Bgpio.WebSocket.init = function() {
  Bgpio.WebSocket.connect();
};

Bgpio.WebSocket.connect = function() {
  Bgpio.WebSocket.ws = new WebSocket(Bgpio.WebSocket.URL);
  Bgpio.WebSocket.ws.onopen = function(evt) { Bgpio.WebSocket.open(evt) };
  Bgpio.WebSocket.ws.onclose = function(evt) { Bgpio.WebSocket.close(evt) };
  Bgpio.WebSocket.ws.onmessage = function(evt) { Bgpio.WebSocket.receive(evt) };
  Bgpio.WebSocket.ws.onerror = function(evt) { Bgpio.WebSocket.error(evt) };
};

Bgpio.WebSocket.open = function(evt) {
  if (Bgpio.DEBUG) console.log("connected\n");
};

Bgpio.WebSocket.close = function(evt) {
  if (Bgpio.DEBUG) console.log("disconnected\n");
};

Bgpio.WebSocket.disconnect = function() {
  if (Bgpio.DEBUG) console.log('closing\n');
  Bgpio.WebSocket.ws.close();
};

Bgpio.WebSocket.send = function(message) {
  console.log("sending: " + message + '\n');
  Bgpio.WebSocket.ws.send(message);
};

Bgpio.WebSocket.receive = function(evt) {
  if (Bgpio.DEBUG) console.log("received: " + evt.data + '\n');
};

Bgpio.WebSocket.error = function(evt) {
  if (Bgpio.DEBUG) console.log('error: ' + evt.data + '\n');
  Bgpio.WebSocket.ws.close();
};

Bgpio.WebSocket.sendCode = function(codeStr) {
  Bgpio.WebSocket.send(
      JSON.stringify({'content': 'python_code', 'code': codeStr}));
};
