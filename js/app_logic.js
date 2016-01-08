/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

var Bgpio = Bgpio || {};

Bgpio.workspace = null;
Bgpio.DEBUG = true;

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

Bgpio.runMode = {
  selected: 0,
  types: ['Simulation', 'Execution'],
  getSelectedMode: function() { return this.types[this.selected]; },
  selectNextMode:  function() {
        this.selected++;
        if (this.selected >= this.types.length) this.selected = 0;
        return this.types[this.selected];
      },
  debugInit: Bgpio.JsInterpreter.debugInit,
  debugStep: Bgpio.JsInterpreter.debugStep,
  showCode: function() { alert('Feature not yet implemented'); },
  run: Bgpio.JsInterpreter.run,
  stop: Bgpio.JsInterpreter.stop,
};

Bgpio.changeMode = function() {
  var modeText = document.getElementById('modeName');
  modeText.innerHTML = Bgpio.runMode.selectNextMode();
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
