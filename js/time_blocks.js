/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

/** Common HSV hue for all blocks in this category. */
var TIME_HUE = 140;

Blockly.Blocks['sleep_ms'] = {
  /**
   * Description.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl('');
    this.setColour(TIME_HUE);
    this.appendValueInput(
          'SLEEP_TIME_MILI', 'Number')
        .setCheck('Number')
        .appendField('wait');
    this.appendDummyInput()
        .appendField('milliseconds');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Wait specific time in milliseconds');
  }
};

/**
 * Description.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.JavaScript['sleep_ms'] = function(block) {
  var delayTime = Blockly.JavaScript.valueToCode(
      block, 'SLEEP_TIME_MILI', Blockly.JavaScript.ORDER_ATOMIC) || '0';

  Blockly.JavaScript.definitions_['function_sleep'] =
      'function sleep(ms) {\n' +
      '  ms += new Date().getTime();\n' +
      '  while (new Date() < ms) {}\n' +
      '}';

  var code = 'sleep(' + delayTime + ');\n';
  return code;
};

/**
 * Description.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Python['sleep_ms'] = function(block) {
  var delayTime = Blockly.Python.valueToCode(
      block, 'SLEEP_TIME_MILI', Blockly.Python.ORDER_ATOMIC) || '0';
  Blockly.Python.definitions_['import_sleep'] = 'from time import sleep';
  var code = 'sleep(' + delayTime / 1000 + ');\n';
  return code;
};
