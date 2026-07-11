export const tinypandaDarkTheme = {
  base: "vs-dark",
  inherit: true,

  rules: [
    // Keywords
    {
      token: "keyword",
      foreground: "1DCEAB",
      fontStyle: "bold"
    },

    // Built-ins
    {
      token: "builtin",
      foreground: "FF7A6B",
      fontStyle: "bold"
    },

    // Variables / identifiers
    {
      token: "identifier",
      foreground: "C7D1CC",
      fontStyle: "italic"
    },

    // Strings
    {
      token: "string",
      foreground: "FFC857"
    },

    // Numbers
    {
      token: "number",
      foreground: "FF8F70"
    },

    // Comments
    {
      token: "comment",
      foreground: "5C6B68",
      fontStyle: "italic"
    },

    // Operators
    { token: "operator", foreground: "8A938F" },
    { token: "delimiter", foreground: "5C6560" },
    { token: "type.identifier", foreground: "8DA8FF" }
  ],

  colors: {
    "editor.background": "#101614",
    "editor.foreground": "#E8E6DE",
    "editorLineNumber.foreground": "#3B4744",
    "editorLineNumber.activeForeground": "#1DCEAB",
    "editor.lineHighlightBackground": "#182420",
    "editorCursor.foreground": "#1DCEAB",
    "editor.selectionBackground": "#1DCEAB33"
  }
};

export const tinypandaLightTheme = {
  base: "vs",
  inherit: true,

  rules: [
    // Keywords
    {
      token: "keyword",
      foreground: "0E7C64",
      fontStyle: "bold"
    },

    // Built-ins
    {
      token: "builtin",
      foreground: "C2452F",
      fontStyle: "bold"
    },

    // Variables / identifiers
    {
      token: "identifier",
      foreground: "2E3A36",
      fontStyle: "italic"
    },

    // Strings
    {
      token: "string",
      foreground: "d37f00"
    },

    // Numbers
    {
      token: "number",
      foreground: "A3512B"
    },

    // Comments
    {
      token: "comment",
      foreground: "8A9490",
      fontStyle: "italic"
    },

    // Operators & delimiters
    { token: "operator", foreground: "33403C" },
    { token: "delimiter", foreground: "5B655F" },
    { token: "type.identifier", foreground: "3547A8" }
  ],

  colors: {
    "editor.background": "#FCFBF8",
    "editor.foreground": "#1B2320",
    "editorLineNumber.foreground": "#D1D5CF",
    "editorLineNumber.activeForeground": "#0E7C64",
    "editor.lineHighlightBackground": "#EFF8F5",
    "editorCursor.foreground": "#0E7C64",
    "editor.selectionBackground": "#1DCEAB2B"
  }
};