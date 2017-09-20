Blockly.JavaScript['typequerystring'] = function(block) {
  var dropdown_type = block.getFieldValue('type');
  var text_name = block.getFieldValue('NAME');
  var value_valuequerystring = Blockly.JavaScript.valueToCode(block, 'valueQueryString', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['inputquerystring1input'] = function(block) {
  var value_modulenamestring = Blockly.JavaScript.valueToCode(block, 'moduleNameString', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_inputfieldinput = Blockly.JavaScript.statementToCode(block, 'inputFieldInput');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['fieldinput'] = function(block) {
  var dropdown_fieldname = block.getFieldValue('fieldName');
  var dropdown_nametype = block.getFieldValue('nameType');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['inputquerystring'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['typemodulenamestring'] = function(block) {
  var text_valuemodulenamestring = block.getFieldValue('valueModuleNameString');
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['typetagname'] = function(block) {
  var text_valuetagname = block.getFieldValue('valueTagName');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['typetaghighway'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};