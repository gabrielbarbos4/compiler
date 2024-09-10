const IGNORE_CHARACTERS = [" ", "\t", "\r", "\n"];
const COMPARISON_OPERATORS = [
  { name: "eq", value: "==" },
  { name: "ne", value: "!=" },
  { name: "gt", value: ">" },
  { name: "lt", value: "<" },
  { name: "ge", value: ">=" },
  { name: "le", value: "<=" },
]
const ARITHMETIC_OPERATORS = [
  { name: "add", value: "+" },
  { name: "subtract", value: "-" },
  { name: "multiply", value: "*" },
  { name: "divide", value: "/" },
  { name: "modulo", value: "%" },
  { name: "assignment", value: "=" },
]
const OPERATORS = [
  ...COMPARISON_OPERATORS,
  ...ARITHMETIC_OPERATORS,
];
const COMMANDS = [
  { name: "rem", value: "rem" },
  { name: "input", value: "input" },
  { name: "let", value: "let" },
  { name: "print", value: "print" },
  { name: "goto", value: "goto" },
  { name: "if", value: "if" },
  { name: "enter", value: "\n" },
  { name: "end", value: "end" }
];

export { IGNORE_CHARACTERS, OPERATORS, COMMANDS, COMPARISON_OPERATORS, ARITHMETIC_OPERATORS }
