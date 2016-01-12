/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

var Bgpio = Bgpio || {};
Bgpio.PythonInterpreter = {};

Bgpio.PythonInterpreter.debugInit = function() {
  if (Bgpio.DEBUG) console.log('Init Python debug');
  alert('Feature not yet implemented.');
};

Bgpio.PythonInterpreter.debugStep = function() {
  if (Bgpio.DEBUG) console.log('Python debug step');
  alert('Feature not yet implemented.');
};

Bgpio.PythonInterpreter.run = function() {
  var code = document.getElementById('pythonCodePre').textContent;
  if (Bgpio.DEBUG) console.log('Run Python code: \n' + code);
  Bgpio.WebSocket.connect(Bgpio.getRaspPiIp());
  Bgpio.WebSocket.sendCode(code);
};

Bgpio.PythonInterpreter.stop = function() {
  if (Bgpio.DEBUG) console.log('Stop running Python code');
  alert('Feature not yet implemented.');
};
