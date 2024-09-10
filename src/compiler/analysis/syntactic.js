"use strict"

import { COMMANDS, ARITHMETIC_OPERATORS, COMPARISON_OPERATORS } from "../gramatic.js";

const analyze = (tokens) => {
  const tokensArray = Array.from(tokens);
  let currentIndex = 0;

  if(tokensArray[tokensArray.length - 1].value !== "end")
    throw new Error("Last token is not 'end'");

  if(!isType(tokensArray[currentIndex], 'integer'))
    throw new Error("First line not starting with digit");

  currentIndex++;

  while(currentIndex !== tokensArray.length - 1) {
    const actualToken = tokensArray[currentIndex];

    if(tokensArray[currentIndex].value === "\n" && !isType(tokensArray[currentIndex + 1], 'integer'))
      throw new Error("Line not starting with digit");

    if(isType(actualToken, 'integer')) {
      if(!isCommand(tokensArray[currentIndex + 1].value))
        throw new Error(`Line not starting with a command. index: ${currentIndex} | character: ${tokensArray[currentIndex + 1].value}`);

      currentIndex++;
    }

    switch(actualToken.value) {
      case "\n":
        currentIndex++;
        break;
      case "rem":
        let nextToken = tokensArray[++currentIndex]

        while(nextToken.value !== "\n") {
          nextToken = tokensArray[++currentIndex];
        }

        currentIndex++;
        break;
      case "input": {
        if(!isType(tokensArray[++currentIndex], 'variable'))
          throw new Error("Token is not variable in front of the input");
        currentIndex++;
        break;
      }
      case "let": {
        let nextToken = tokensArray[++currentIndex]

        if(!isType(nextToken, 'variable'))
          throw new Error("Token is not a variable after let");

        nextToken = tokensArray[++currentIndex];

        if(nextToken.value !== "=")
          throw new Error("Token is not a '=' after the variable");

        let pairAuxArray = [];

        while(nextToken.value !== "\n") {
          pairAuxArray.push(nextToken);

          currentIndex++;
          nextToken = tokensArray[currentIndex];
        }

        if(pairAuxArray.length > 4)
          throw new Error("Invalid simple operation")

        for(let i = 0; i < pairAuxArray.length; i += 2) {
          if(pairAuxArray[i + 1].value === "-") {
            if(pairAuxArray[i + 2].value !== "1")
              throw new Error("Invalid token stack for let operation with negative operator")

            i++;
          } else {
            const isOperator = isType(pairAuxArray[i], 'operator');
            let isArithmeticOperator = isArithmeticOperators(pairAuxArray[i].value);

            // ignore =
            if(i === 0) {
              isArithmeticOperator = true;
            }

            if(!(isOperator && isArithmeticOperator && (isType(pairAuxArray[i + 1], 'variable') || isType(pairAuxArray[i + 1], 'integer'))))
              throw new Error(`Invalid token stack for 'let' operation. Values analyzed: ${pairAuxArray[i].value} | ${pairAuxArray[i + 1].value}`)
          }
        }

        currentIndex++;
        break;
      }
      case "print": {
        const nextToken = tokensArray[++currentIndex];

        if(!isType(nextToken, 'variable'))
          throw new Error(`Token after print action is not valid: ${nextToken.value}`)

        currentIndex++;
        break;
      }
      case "goto": {
        let nextToken = tokensArray[++currentIndex];

        if(!isType(nextToken, 'integer'))
          throw new Error(`Token after goto is not an integer: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex]

        if(nextToken.value !== "\n")
          throw new Error(`Token after goto statement is not a '\\n'': ${nextToken.value}`);

        break;
      }
      case "if": {
        let nextToken = tokensArray[++currentIndex]

        if(!(isType(nextToken, 'integer') || isType(nextToken, 'variable')))
          throw new Error(`First token after 'if' is not a variable or an integer: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex];

        if(!isComparisonOperator(nextToken.value))
          throw new Error(`Second token after 'if' is not an comparison operator: ${nextToken.value}`);

        nextToken = tokensArray[++currentIndex];

        if(!(isType(nextToken, 'integer') || isType(nextToken, 'variable')))
          throw new Error(`Third token after 'if' is not a variable or an integer: ${nextToken.value}`);

        currentIndex++;
        break;
      }
      case "end": {
        break;
      }
    }
  }
}

const isComparisonOperator = (value) => {
  return COMPARISON_OPERATORS.find(operator => operator.value === value) !== undefined;
}

const isCommand = (value) => {
  return COMMANDS.filter(command => command.name !== "enter").find(command => command.value === value) !== undefined;
}

const isArithmeticOperators = (value) => {
  return ARITHMETIC_OPERATORS
    .filter(operator => operator.value !== "=")
    .find(operator => operator.value === value) !== undefined;
}

const isType = (token, type) => {
  return token.type === type;
}

export { analyze }
