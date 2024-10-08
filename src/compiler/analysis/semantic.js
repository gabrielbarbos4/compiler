"use strict"

const analyze = (tokens) => {
  const LINES = new Set();
  const VARIABLES = new Set();
  const GOTO_DECLARED_LINES = new Set();

  const tokensArray = Array.from(tokens);
  let currentIndex = 0;

  LINES.add(Number(tokensArray[currentIndex++].value));

  while(currentIndex !== tokensArray.length - 1) {
    const actualToken = tokensArray[currentIndex];

    if(isType(actualToken, 'integer') && tokensArray[currentIndex - 1].value === "\n") {
      LINES.add(Number(actualToken.value));
    }

    switch(actualToken.value) {
      case "input": {
        VARIABLES.add(tokensArray[++currentIndex].value);

        currentIndex++;
        break;
      }
      case "print": {
        const nextToken = tokensArray[++currentIndex];

        if(isType(nextToken, 'variable') && !VARIABLES.has(nextToken.value))
          throw new Error(`Undeclared variable: ${nextToken.value}`);

        currentIndex++;
        break;
      }
      case "if": {
        let nextToken = tokensArray[++currentIndex];

        while(nextToken.value !== "\n") {
          if(isType(nextToken, 'variable') && !VARIABLES.has(nextToken.value))
            throw new Error(`Undeclared variable: ${nextToken.value}`);

          if(nextToken.value === "goto")
            GOTO_DECLARED_LINES.add(Number(tokensArray[currentIndex + 1].value))

          currentIndex++;
          nextToken = tokensArray[currentIndex];
        }

        currentIndex++;
        break;
      }
      case "let": {
        let nextToken = tokensArray[++currentIndex];

        VARIABLES.add(nextToken.value);

        while(nextToken.value !== "\n") {
          if(isType(nextToken, 'variable') && !VARIABLES.has(nextToken.value))
            throw new Error(`Undeclared variable: ${nextToken.value}`);

          currentIndex++;
          nextToken = tokensArray[currentIndex];
        }

        currentIndex++;
        break;
      }
      case "goto": {
        const { value } = tokensArray[++currentIndex];

        GOTO_DECLARED_LINES.add(Number(value));

        currentIndex++;
        break;
      }
      case "end": {
        break;
      }
      default:
        currentIndex++;
        break;
    }
  }

  validateLineOrder(LINES);
  validateGotoDeclarations(GOTO_DECLARED_LINES, LINES);
}

const validateLineOrder = (lines) => {
  const linesArray = Array.from(lines);

  for(let i = 0; i < linesArray.length - 1; i++) {
    if(linesArray[i + 1] < linesArray[i])
      throw new Error(`Line order is not being displayed in ascending order | lines analyzed: ${linesArray[i + 1]} - ${linesArray[i]}`)
  }
}

const validateGotoDeclarations = (declaredLines, lines) => {
  const declarationsArray = Array.from(declaredLines);

  declarationsArray.forEach(declaration => {
    if(!lines.has(declaration))
      throw new Error(`Nonexistent line for GOTO declaration: ${declaration}`)
  });
}

const isType = (token, type) => {
  return token.type === type;
}

export { analyze }
