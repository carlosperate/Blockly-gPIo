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
Bgpio.JsInterpreter.highlightPause = false;
Bgpio.JsInterpreter.stopProcess = false;

Bgpio.JsInterpreter.debugInit = function() {
  if (Bgpio.DEBUG) console.log('Init JavaScript debug');

  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.addReservedWords('highlightDiagramPin');
  var code = Bgpio.generateJavaScriptCode();
  Bgpio.JsInterpreter.myInterpreter = new Interpreter(
      code, Bgpio.JsInterpreter.debugInterpreterInit);

  if (Bgpio.DEBUG) console.log('About to debug code:\n' + code);
  document.getElementById('debugStepButton').disabled = '';
  Bgpio.JsInterpreter.highlightPause = false;
  Bgpio.workspace.traceOn(true);
  Bgpio.workspace.highlightBlock(null);
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
    if (Bgpio.JsInterpreter.highlightPause) {
      // A block has been highlighted.  Pause execution here.
      Bgpio.JsInterpreter.highlightPause = false;
    } else {
      // Keep executing until a highlight statement is reached.
      recursiveStep();
    }
  };
  recursiveStep();
};

Bgpio.JsInterpreter.run = function() {
  if (Bgpio.DEBUG) console.log('Running JavaScript code');
  // Update buttons and refresh the DOM before freezed by execution
  var runButton = document.getElementById('runButton');
  var stopButton = document.getElementById('stopButton');
  runButton.disabled= 'disabled';
  stopButton.disabled = '';

  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
      '  if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  Blockly.JavaScript.STATEMENT_PREFIX =
      'if (Bgpio.JsInterpreter.stopProcess) break MAIN_PROGRAM;\n';
  var code = Bgpio.generateJavaScriptCode();
  code = 'MAIN_PROGRAM: do {\n' + code + '} while(false);';
  if (Bgpio.DEBUG) console.log('About to run code:\n' + code);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  setTimeout(function() {
    Bgpio.JsInterpreter.stopProcess = false;
    try {
      eval(code);
    } catch (e) {
      alert(e);
    }
    stopButton.disabled = 'disabled';
    runButton.disabled= '';
    Bgpio.JsInterpreter.stopProcess = false;
  }, 250);
};

Bgpio.JsInterpreter.stop = function() {
  Bgpio.JsInterpreter.stopProcess = true;
  if (Bgpio.DEBUG) console.log('Running JavaScript manually stopped');
};

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

  // Add an API function for simulating pins
  var wrapper = function(pin, value) {
    pin = pin ? pin.toString() : '';
    value = value ? value.toString() : '';
    return interpreter.createPrimitive(highlightDiagramPin(pin, value));
  };
  interpreter.setProperty(scope, 'highlightDiagramPin',
      interpreter.createNativeFunction(wrapper));
};

function highlightBlock(id) {
  Bgpio.workspace.highlightBlock(id);
  Bgpio.JsInterpreter.highlightPause = true;
}

function highlightDiagramPin(pin, value) {
  if (Bgpio.DEBUG) console.log('pin->' + pin + ' set ' + value);
}
