import fs from "fs";

const operations = {
  READ: 10,
  WRITE: 11,
  LOAD: 20,
  STORE: 21,
  ADD: 30,
  SUBTRACT: 31,
  DIVIDE: 32,
  MULTIPLY: 33,
  MODULE: 34,
  BRANCH: 40,
  BRANCHNEG: 41,
  BRANCHZERO: 42,
  HALT: 43
};
const instructions = [];
const variables = {};
// TODO remove -1 from initial value
const constants = {};
const memory = {}

let nextVariableAddress = 10;
let nextConstantAddress = 80;

// Allocation Functions
function allocateVariable(variable, value = 0) {
  variables[variable] = { variable, value, address: nextVariableAddress }
  memory[nextVariableAddress] = value;
  nextVariableAddress++;
}

function allocateConstant(value) {
  constants[value] = { value: Number(value), address: nextConstantAddress };
  memory[nextConstantAddress] = Number(value);
  nextConstantAddress++;
}

function allocateAny(value) {
  if(isCharacter(value)) {
    if(!variables[value]) {
      allocateVariable(value);
    }
  } else {
    if(!constants[value]) {
      allocateConstant(value);
    }
  }
}

function pushInstruction(command, memoryPosition) {
  instructions.push(`+${command}${memoryPosition}`);
}

// Auxiliary Functions
function isCharacter(char) {
  return /^[a-z]$/.test(char);
}

// Execution Functions
function executeIfGoto(line) {
  console.log('Executando comando: if/goto');

  let firstTerm = line[1];
  let operator = line[2];
  let secondTerm = line[3];
  let gotoLine = line[5];

  allocateAny(firstTerm)
  allocateAny(secondTerm)

  const firsTermAddress = isCharacter(firstTerm) ? variables[firstTerm].address : constants[firstTerm].address
  const secondTermAddress = isCharacter(firstTerm) ? variables[firstTerm].address : constants[firstTerm].address

  //TODO add goto to specific memory location

  if(operator === `<`) {
    pushInstruction(operations.LOAD, firsTermAddress);
    pushInstruction(operations.SUBTRACT, secondTermAddress);
    pushInstruction(operations.BRANCHNEG, gotoLine);
  }
  if(operator === `<=`) {
    pushInstruction(operations.LOAD, firsTermAddress);
    pushInstruction(operations.SUBTRACT, secondTermAddress);
    pushInstruction(operations.BRANCHZERO, gotoLine);
    pushInstruction(operations.BRANCHNEG, gotoLine);
  }
  if(operator === `>`) {
    pushInstruction(operations.LOAD, secondTermAddress);
    pushInstruction(operations.SUBTRACT, firsTermAddress);
    pushInstruction(operations.BRANCHNEG, gotoLine);
  }
  if(operator === `>=`) {
    pushInstruction(operations.LOAD, secondTermAddress);
    pushInstruction(operations.SUBTRACT, firsTermAddress);
    pushInstruction(operations.BRANCHZERO, gotoLine);
    pushInstruction(operations.BRANCHNEG, gotoLine);
  }
  if(operator === `==`) {
    pushInstruction(operations.LOAD, firsTermAddress);
    pushInstruction(operations.SUBTRACT, secondTermAddress);
    pushInstruction(operations.BRANCHZERO, gotoLine);
  }
  if(operator === `!=`) {
    pushInstruction(operations.LOAD, firsTermAddress);
    pushInstruction(operations.SUBTRACT, secondTermAddress);
    pushInstruction(operations.BRANCHNEG, gotoLine);

    pushInstruction(operations.LOAD, secondTermAddress);
    pushInstruction(operations.SUBTRACT, firstTerm);
    pushInstruction(operations.BRANCHNEG, gotoLine);
  }
}

function executeInput(line) {
  console.log("Executando Input");

  pushInstruction(operations.READ, nextVariableAddress);
  allocateVariable(line[1]);
}

function executePrint(line) {
  console.log('Executando comando: print');

  pushInstruction(operations.WRITE, variables[line[1]].address);
}

function executeGoto(line) {
  console.log('Executando comando: goto');

  //TODO add goto to specific memory location
  pushInstruction(operations.BRANCH, line[1]);
}

function executeLet(line) {
  console.log('Executando comando: let');

  const firstTerm = line[1];
  const secondTerm = line[3];

  if(!variables[firstTerm]) {
    allocateVariable(firstTerm);
  }

  allocateAny(secondTerm);

  const firstVariableAddress = variables[firstTerm].address;
  const secondVariableAddress = isCharacter(secondTerm) ? variables[secondTerm].address : constants[secondTerm].address;

  if(line.length === 4) {
    pushInstruction(operations.LOAD, secondVariableAddress);
    pushInstruction(operations.STORE, firstVariableAddress);

    return;
  }

  const operator = line[4];
  const thirdTerm = line[5];

  allocateAny(thirdTerm);

  const thirdTermAddress = isCharacter(thirdTerm) ? variables[thirdTerm].address : constants[thirdTerm].address;

  pushInstruction(operations.LOAD, secondVariableAddress);

  if(operator === `+`) pushInstruction(operations.ADD, thirdTermAddress);
  if(operator === `-`) pushInstruction(operations.SUBTRACT, thirdTermAddress);
  if(operator === `/`) pushInstruction(operations.DIVIDE, thirdTermAddress);
  if(operator === `*`) pushInstruction(operations.MULTIPLY, thirdTermAddress);
  if(operator === `%`) pushInstruction(operations.MODULE, thirdTermAddress);

  pushInstruction(operations.STORE, firstVariableAddress);
}

function executeEnd() {
  console.log('Executando comando: end');

  pushInstruction(operations.HALT, "00");
}

function executeRem() {
  console.log('Executando comando: rem');
}

// MAIN
function analyzeLine(line) {
  let initialCommand = line[0];

  if(line.includes('goto') && line.includes('if')) {
    initialCommand = "if/goto"
  }

  switch (initialCommand) {
    case 'rem': executeRem(); break;
    case 'input': executeInput(line); break;
    case 'print': executePrint(line); break;
    case 'if/goto': executeIfGoto(line); break;
    case 'goto': executeGoto(line); break;
    case 'let': executeLet(line); break;
    case 'end': executeEnd(); break;
    default: console.log('Comando desconhecido.');
  }
}

const execute = (code) => {
  const lines = code.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  lines.forEach(line => analyzeLine(line.split(" ").slice(1)));

  // TODO review, check if the number can be bigger than 99
  Object.keys(constants).forEach(k => instructions.push(`${k < 0 ? '-' : '+'}00${k < 10 ? '0' + Math.abs(k) : k}`));
  Object.keys(variables).forEach(k => instructions.push("+0000"));

  console.table(instructions);
}

export { execute }
