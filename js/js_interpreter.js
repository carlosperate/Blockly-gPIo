/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

var Bgpio = Bgpio || {};
Bgpio.JsInterpreter = {};

Bgpio.JsInterpreter.myInterpreter = null;
Bgpio.JsInterpreter.stepping = false;
Bgpio.JsInterpreter.pauseProcess = false;

Bgpio.JsInterpreter.debugInit = function() {
  if (Bgpio.DEBUG) console.log('Init JavaScript debug');
  Bgpio.JsInterpreter.stepping = true;
  document.getElementById('debugStepButton').disabled = '';
  Bgpio.JsInterpreter.prepareNewRun();

  // Generate JavaScript code and parse it
  Bgpio.JsInterpreter.myInterpreter = new Interpreter(
      Bgpio.JsInterpreter.prepareJavaScript(),
      Bgpio.JsInterpreter.debugInterpreterInit);
};

Bgpio.JsInterpreter.debugStep = function() {
  if (Bgpio.DEBUG) console.log('JavaScript debug step');
  var recursiveStep = function() {
    try {
      var ok = Bgpio.JsInterpreter.myInterpreter.step();
    } finally {
      if (!ok) {
        // Program complete, no more code to execute.
        if (Bgpio.DEBUG) console.log('Javascript Debug steps ended');
        document.getElementById('debugStepButton').disabled = 'disabled';
        return;
      }
    }
    if (Bgpio.JsInterpreter.pauseProcess) {
      // A block has been highlighted.  Pause execution here.
      Bgpio.JsInterpreter.pauseProcess = false;
    } else {
      recursiveStep();
    }
  };
  recursiveStep();
};

Bgpio.JsInterpreter.run = function() {
  if (Bgpio.DEBUG) console.log('Running JavaScript simulation');
  Bgpio.JsInterpreter.stepping = false;

  // Update buttons and prepare the page
  var runButton = document.getElementById('runButton');
  var stopButton = document.getElementById('stopButton');
  runButton.disabled= 'disabled';
  stopButton.disabled = '';
  Bgpio.JsInterpreter.prepareNewRun();

  // Generate JavaScript code and parse it
  Bgpio.JsInterpreter.myInterpreter = new Interpreter(
      Bgpio.JsInterpreter.prepareJavaScript(),
      Bgpio.JsInterpreter.debugInterpreterInit);

  var recursiveStep = function() {
    var stop = false;
    try {
      var ok = Bgpio.JsInterpreter.myInterpreter.step();
    } finally {
      if (!ok) stop = true;
    }
    if (Bgpio.JsInterpreter.pauseProcess) {
      stop = true;
    } else {
      // Add the next step to the event loop to not freeze the browser
      setTimeout(recursiveStep, 0);
    }
    if (stop) {
      stopButton.disabled = 'disabled';
      runButton.disabled= '';
    }
  };
  recursiveStep();
};

Bgpio.JsInterpreter.stop = function() {
  if (Bgpio.DEBUG) console.log('Manually stopping running JavaScript');
  Bgpio.JsInterpreter.pauseProcess = true;
};

Bgpio.JsInterpreter.prepareNewRun = function() {
  Bgpio.JsInterpreter.pauseProcess = false;
  Bgpio.workspace.traceOn(true);
  Bgpio.workspace.highlightBlock(null);
  Bgpio.setPinDefaults();
};

Bgpio.JsInterpreter.prepareJavaScript = function() {
  Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.addReservedWords('setDiagramPin');
  Blockly.JavaScript.addReservedWords('delayMs');

  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  if (Bgpio.JsInterpreter.stepping) {
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  } else {
    Blockly.JavaScript.STATEMENT_PREFIX = null;
  }
  var code = Bgpio.generateJavaScriptCode();
  if (Bgpio.DEBUG) console.log('About to execute code:\n' + code);
  return code;
};

/*******************************************************************************
 * Below functions prepare the interpreter external API calls
 ******************************************************************************/
Bgpio.JsInterpreter.debugInterpreterInit = function(interpreter, scope) {
  // Add an API function for the alert() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(alert(text));
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for waiting an amount of time
  var wrapper = function(ms) {
    ms = Bgpio.JsInterpreter.parseAcornObject(ms);
    return interpreter.createPrimitive(delayMs(ms));
  };
  interpreter.setProperty(scope, 'delayMs',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for simulating pins
  var wrapper = function(pin, value) {
    pin = Bgpio.JsInterpreter.parseAcornObject(pin);
    value = Bgpio.JsInterpreter.parseAcornObject(value);
    return interpreter.createPrimitive(setDiagramPin(pin, value));
  };
  interpreter.setProperty(scope, 'setDiagramPin',
      interpreter.createNativeFunction(wrapper));
};

Bgpio.JsInterpreter.parseAcornObject = function(acornObj) {
  return acornObj.isPrimitive ? acornObj.valueOf() : acornObj.toString();
};

function highlightBlock(id) {
  Bgpio.workspace.highlightBlock(id);
  Bgpio.JsInterpreter.pauseProcess = true;
}

function setDiagramPin(pin, value) {
  if (Bgpio.DEBUG) console.log('pin->' + pin + ' set ' + value);
  Bgpio.setPinDigital(pin, value);
}

function delayMs(ms) {
  if (Bgpio.DEBUG) console.log('wait for ' + ms + ' ms');
  if (Bgpio.JsInterpreter.stepping) return;
  var waitUntil = ms + new Date().getTime();
  while (new Date().getTime() < waitUntil) {;}
}
