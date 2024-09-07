"use strict"

const { ACTIONS, OPERATORS, ignore_characters } = require("./gramatic");
const TOKENS = new Set();
let currentIndex = 0;

const analyze = (fileString) => {

  while(currentIndex !== fileString.length) {
    const character = fileString.charAt(currentIndex);
    let validated = false;

    if(character === "\n") {
      TOKENS.add({ type: "action", value: "\n" });
      currentIndex++;
      validated = true;
    }

    if(!validated && isIgnore(character)) {
      currentIndex++;
      validated = true;
    }

    if(!validated && isDigit(character)) {
      let digit = character
      let nextChar = fileString.charAt(currentIndex + 1);

      while(isDigit(nextChar)) {
        digit += nextChar;
        currentIndex++;
        nextChar = fileString.charAt(currentIndex + 1);
      }

      if(!isIgnore(nextChar))
        throw new Error(`Nao eh ignore char apos um numero`)

      TOKENS.add({ type: "integer", value: digit });
      currentIndex++;
      validated = true;
    }

    isUppercase(character)

    if(!validated && isOperator(character)) {
      let finalOperator = character;
      const nextChar = fileString.charAt(currentIndex + 1);

      if(character === "-") {
        let validChar = nextChar === " " || nextChar === "1";

        if(!validChar) {
          throw new Error(`Caracter invalido a frente do sinal ${character}: ${nextChar === " "}`)
        }
      } else {
        if(isOperator(nextChar)) {
          const nextCharNextDoubleOperator = fileString.charAt(currentIndex + 2);

          if(!isIgnore(nextCharNextDoubleOperator))
            throw new Error(`Caracter inválido após operador: ${finalOperator += nextChar} | caracter: ${nextChar}`)

          finalOperator += nextChar;
          currentIndex += 2;
        } else if(!isIgnore(nextChar)) {
          throw new Error(`Caracter invalido apos operador: ${nextChar}`)
        }
      }

      TOKENS.add({ type: "operator", value: finalOperator });
      currentIndex++;
      validated = true;
    }

    const nextChar = fileString.charAt(currentIndex + 1);

    if(!validated && !isIgnore(nextChar)) {
      const actionValidation = isAction(character, fileString, currentIndex);

      if(actionValidation.isAction) {
        currentIndex += actionValidation.walkedIndexCounter;

        TOKENS.add({ type: "action", value: actionValidation.moutedWord });
        validated = true;
      }
    }

    if((!validated && isIgnore(nextChar) || nextChar === "\n") && /^[a-z]$/.test(character)) {
      TOKENS.add({ type: "variable", value: character });
      currentIndex++;
      validated = true;
    }

    if(!validated) 
      throw new Error(`Não validado: ${character}, next: ${nextChar}`);
  }

  return TOKENS;
}

const isAction = (character, fileString, currentIndex) => {
  let possibleAction;


  possibleAction = character === "i"
    ? ACTIONS.find(action => action.value.charAt(0) === character && action.value.charAt(1) === fileString.charAt(currentIndex + 1))
    : ACTIONS.find(action => action.value.charAt(0) === character)

  if(!possibleAction) return { isAction: false }

  let moutedWord = character;
  let walkedIndexCounter = 0;

  for(let i = 0; i < possibleAction.value.length - 1; i++) {
    const nextChar = fileString.charAt(currentIndex + 1);
    isUppercase(nextChar);   
    moutedWord += nextChar;

    currentIndex++;
    walkedIndexCounter++;
  }

  walkedIndexCounter++;

  if(moutedWord === "rem") {
    let currentIndexAux = walkedIndexCounter;
    let nextChar = fileString.charAt(currentIndexAux);

    while(nextChar !== "\n") {
      currentIndexAux++;
      walkedIndexCounter++;
      nextChar = fileString.charAt(currentIndexAux);
    }
  }

  if(moutedWord === "end") {
    return { walkedIndexCounter, moutedWord, isAction: true }
  }

  if(moutedWord !== possibleAction.value || !isIgnore(fileString.charAt(currentIndex + 1)))
    throw new Error(`Ação não presente na gramatica ${character} - ${moutedWord}`)

  return { walkedIndexCounter, moutedWord, isAction: true }
}

const isOperator = (character) => {
  return OPERATORS.find(operator => operator.value === character) !== undefined
}

const isDigit = (character) => {
  return /^\d+$/.test(character)
}

const isIgnore = (character) => {
  return ignore_characters.find(c => c === character) !== undefined 
}

const isUppercase = (character) => {
  if(/^[A-Z]$/.test(character))
    throw new Error(`Caracter maiusculo nao eh valido`)
}

module.exports = { analyze }
