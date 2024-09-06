"use strict"

let currentIndex = 0;
const TOKENS = new Set();
const ignore_characters = new Set("\n", "");
const OPERATORS = [
  { name: "assignment", value: "=" }
]
const ACTIONS = [
  { name: "rem", value: "rem" }
]

const analyze = (fileString) => {

  while(currentIndex != fileString.length) {
    const character = fileString.charAt(currentIndex);
    let validated = false;

    if(isIgnore(character)) {
      currentIndex++;
      validated = true;
    }

    if(!validated && isDigit(character)) {
      let digit = character
      const nextChar = fileString.charAt(currentIndex + 1);

      while(isDigit(nextChar)) {
        digit += nextChar;
        currentIndex++;
      }

      TOKENS.add({ type: "integer", value: digit });
    }

    if(!validated && isOperator(character)) {
      let finalOperator = character;
      const nextChar = fileString.charAt(currentIndex + 1);

      if(isOperator(nextChar)) {
        finalOperator += nextChar;
        currentIndex += 2;
      } else if(!isIgnore(nextChar)) {
        throw new Error("Caracter invalido apos operador")
      }

      TOKENS.add({ type: "operator", value: finalOperator });
    }

    const nextChar = fileString.charAt(currentIndex + 1);

    if(!validated && !isIgnore(nextChar)) {
      const actionValidation = isAction(character, fileString, currentIndex);

      if(actionValidation.isAction) {
        currentIndex += actionValidation.walkedIndexCounter
        TOKENS.add({ type: "action", value: actionValidation.moutedWord })   
      }
    }

    if(!validated && nextChar === " ") {
      // TODO validar se o caracter eh minusculo
      TOKENS.add({ type: "variable", value: character });
    }

    if(!validated) throw new Error("fora da gramatica")
  }

  TOKENS.forEach(token => console.log(token));
}

const isAction = (character, fileString, currentIndex) => {
  const possibleAction = ACTIONS.find(action => action.value.charAt(0) === character);

  if(!possibleAction) return { isAction: false }

  const moutedWord = character;
  const walkedIndexCounter = 0;

  for(let i = 0; i < possibleAction.value.length - 1; i++) {
    moutedWord += fileString.charAt(currentIndex + 1);

    currentIndex++;
    walkedIndexCounter++;
  }

  walkedIndexCounter++;

  if(moutedWord !== possibleAction.value) throw new Error("Token nao presente na gramatica")

  return {
    walkedIndexCounter,
    moutedWord,
    isAction: true
  }
}

const isOperator = (character) => {
  return OPERATORS
    .find(operator => operator.value === character) !== undefined
}

const isDigit = (character) => {
  return /^\d+$/.test(character)
}

const isIgnore = (character) => {
  return ignore_characters.has(character) 
}

module.exports = { analyze }
