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
};

Bgpio.PythonInterpreter.debugStep = function() {
  if (Bgpio.DEBUG) console.log('Python debug step');
};

Bgpio.PythonInterpreter.run = function() {
  if (Bgpio.DEBUG) console.log('Run Python code');
};
