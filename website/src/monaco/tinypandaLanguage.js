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
    "=",
    "+",
    "-",
    "*",
    "/",
    "!",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "!=",
  ],

  builtins: [
    "echo",
    "echoln",
    "len",
    "num",
    "str",
  ],

  tokenizer: {
    root: [
      // Keywords & identifiers
      [/[a-zA-Z_][\w]*/, {
        cases: {
          "@keywords": "keyword",
          "@builtins": "builtin",
          "@default": "identifier"
        }
      }],

      // Numbers
      [/\d+/, "number"],

      // Strings
      [/"/, { token: "string.quote", next: "@string" }],

      // Operators
      [/[+\-*/=!<>]+/, "operator"],

      // Brackets
      [/[{}()]/, "@brackets"],

      // Delimiters
      [/[;,]/, "delimiter"],

      // Comments (if you use //)
      [/\/\/.*$/, "comment"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, { token: "string.quote", next: "@pop" }],
    ],
  },
};