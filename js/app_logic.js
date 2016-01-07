/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

var Bgpio = Bgpio || {};

Bgpio.workspace = null;
Bgpio.myInterpreter = null;

Bgpio.init = function () {
  Bgpio.workspace = Blockly.inject('blocklyDiv', {
      media: 'blockly/media/',
      toolbox: document.getElementById('toolbox')
  });
  Blockly.Xml.domToWorkspace(Bgpio.workspace,
      document.getElementById('startBlocks'));
};

window.addEventListener('load', function load(event) {
  window.removeEventListener('load', load, false);
  Bgpio.init();
});

Bgpio.initApi = function(interpreter, scope) {
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

Bgpio.highlightPause = false;

function highlightBlock(id) {
  Bgpio.workspace.highlightBlock(id);
  Bgpio.highlightPause = true;
}

function highlightDiagramPin(pin, value) {
  alert('(temp) pin->' + pin + ' set ' + value);
}

Bgpio.parseCode= function() {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  Blockly.JavaScript.addReservedWords('highlightDiagramPin');
  var code = Bgpio.generateJavaScriptCode();
  Bgpio.myInterpreter = new Interpreter(code, Bgpio.initApi);

  alert('Ready to execute this code:\n\n' + code);
  document.getElementById('stepButton').disabled = '';
  Bgpio.highlightPause = false;
  Bgpio.workspace.traceOn(true);
  Bgpio.workspace.highlightBlock(null);
};

Bgpio.stepCode = function() {
  try {
    var ok = Bgpio.myInterpreter.step();
  } finally {
    if (!ok) {
      // Program complete, no more code to execute.
      document.getElementById('stepButton').disabled = 'disabled';
      return;
    }
  }
  if (Bgpio.highlightPause) {
    // A block has been highlighted.  Pause execution here.
    Bgpio.highlightPause = false;
  } else {
    // Keep executing until a highlight statement is reached.
    Bgpio.stepCode();
  }
};

Bgpio.simulate = function() {
  alert('not yet implemented');
};

Bgpio.runPython = function() {
  alert('not yet implemented');
};

Bgpio.toggleView = function() {
  // Still need to be written
  alert(Bgpio.generatePythonCode());
};

Bgpio.generateJavaScriptCode = function() {
  return Blockly.JavaScript.workspaceToCode(Bgpio.workspace);
};

Bgpio.generatePythonCode = function() {
  return Blockly.Python.workspaceToCode(Bgpio.workspace);
};

Bgpio.generateXml = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(Bgpio.workspace);
  var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
  return xmlText;
};
