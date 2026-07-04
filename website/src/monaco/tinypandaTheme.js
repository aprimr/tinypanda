export const tinypandaDarkTheme = {
  base: "vs-dark",
  inherit: true,

  rules: [
    // TinyPanda keywords
    {
      token: "keyword",
      foreground: "1DCEAB",
      fontStyle: "bold"
    },

    // Built-in functions
    {
      token: "builtin",
      foreground: "1DCEAB",
      fontStyle: "bold"
    },

    // Variables
    {
      token: "identifier",
      foreground: "D4D4D4"
    },

    // Strings
    {
      token: "string",
      foreground: "CE9178"
    },

    // Numbers
    {
      token: "number",
      foreground: "B5CEA8"
    },

    // Comments
    {
      token: "comment",
      foreground: "6A9955",
      fontStyle: "italic"
    },

    // Operators
    {
      token: "operator",
      foreground: "D4D4D4"
    },

    {
      token: "delimiter",
      foreground: "808080"
    },

    {
      token: "type.identifier",
      foreground: "4EC9B0"
    }
  ],

  colors: {}
};

export const tinypandaLightTheme = {
  base: "vs",
  inherit: true,

  rules: [
    {
      token: "keyword",
      foreground: "1DCEAB",
      fontStyle: "bold"
    },

    {
      token: "builtin",
      foreground: "1DCEAB",
      fontStyle: "bold"
    },

    {
      token: "identifier",
      foreground: "24292F"
    },

    {
      token: "string",
      foreground: "A31515"
    },

    {
      token: "number",
      foreground: "098658"
    },

    {
      token: "comment",
      foreground: "008000",
      fontStyle: "italic"
    },

    {
      token: "operator",
      foreground: "000000"
    },

    {
      token: "delimiter",
      foreground: "808080"
    },

    {
      token: "type.identifier",
      foreground: "267F99"
    }
  ],

  colors: {}
};