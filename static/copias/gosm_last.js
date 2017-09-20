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
  var statements_typeelementinput = Blockly.JavaScript.statementToCode(block, 'typeElementInput');
  var statements_typeoutputinput = Blockly.JavaScript.statementToCode(block, 'typeOutputInput');
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

Blockly.JavaScript['typetagplace'] = function(block) {
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['typefield'] = function(block) {
  var text_id = block.getFieldValue('id');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['typefieldloc'] = function(block) {
  var text_lng = block.getFieldValue('lng');
  var text_lat = block.getFieldValue('lat');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['typefiedinput'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['typequeryandinput'] = function(block) {
  var value_name1 = Blockly.JavaScript.valueToCode(block, 'NAME1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_name2 = Blockly.JavaScript.valueToCode(block, 'NAME2', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['elementpoint'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['outputgeojson'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['outputjson'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};