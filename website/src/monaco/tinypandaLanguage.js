export const tinypandaLanguage = {
  keywords: [
    "bamboo",
    "fn",
    "iff",
    "otherwise",
    "return",
    "true",
    "false",
  ],

  operators: [
    "=", "+", "-", "*", "/", "!", "<", ">", "<=", ">=", "==", "!=",
  ],

  builtins: [
    "echo",
    "echoln",
    "len",
    "num",
    "str",
    "upper",
    "lower",
  ],

  tokenizer: {
    root: [
      // 1. ALWAYS parse whitespace and comments first to bypass keyword/operator rules
      { include: '@whitespace' },

      // 2. Strings
      [/"/, { token: "string.quote", next: "@string" }],

      // 3. Keywords & Builtins & Identifiers
      [/[a-zA-Z_][\w]*/, {
        cases: {
          "@keywords": "keyword",
          "@builtins": "builtin",
          "@default": "identifier"
        }
      }],

      // 4. Numbers
      [/\d+/, "number"],

      // 5. Operators
      [/[+\-*/=!<>]+/, "operator"],

      // 6. Brackets & Delimiters
      [/[{}()]/, "@brackets"],
      [/[;,]/, "delimiter"],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\/.*$/, 'comment'], 
      [/\/\*/, 'comment', '@comment'], 
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", next: "@pop" }],
    ],
  },
};