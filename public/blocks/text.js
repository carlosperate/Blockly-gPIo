/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview Description.
 */
'use strict';

/** Overwriting JavaScript generator to print into the html "fake console" */
Blockly.JavaScript['text_print'] = function(block) {
  // Print statement.
  var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'jsPrint(' + argument0 + ');\n';
};
