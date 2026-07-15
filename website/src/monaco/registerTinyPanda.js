import { tinypandaLanguage } from "./tinypandaLanguage";
import {
  tinypandaDarkTheme,
  tinypandaLightTheme,
} from "./tinypandaTheme";

export function registerTinyPanda(monaco) {
  const languageId = "tinypanda";

  // Core Registration
  if (!monaco.languages.getLanguages().some((lang) => lang.id === languageId)) {
    monaco.languages.register({ id: languageId });
  }

  monaco.languages.setMonarchTokensProvider(languageId, tinypandaLanguage);
  monaco.editor.defineTheme("tinypanda-dark", tinypandaDarkTheme);
  monaco.editor.defineTheme("tinypanda-light", tinypandaLightTheme);

  // Pair Config (Fixes auto-closing brackets and quotes)
  monaco.languages.setLanguageConfiguration(languageId, {
    comments: {
      lineComment: "//",       
      blockComment: ["/*", "*/"] 
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string", "comment"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });

  // Autocomplete / IntelliSense Configuration
  monaco.languages.registerCompletionItemProvider(languageId, {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        // --- Keywords ---
        {
          label: "bamboo",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "bamboo ",
          detail: "Variable declaration statement",
        },
        {
          label: "true",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "true ",
          detail: "true boolean value",
        },
        {
          label: "false",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "false ",
          detail: "false boolean value",
        },
        {
          label: "return",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "return ${1:value};",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "return statement",
        },
        {
          label: "iff",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "iff (${1:condition}) {\n\t${2:// statement}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Conditional iff statement block",
          documentation: "Executes the enclosed block if the target condition evaluates to true.",
        },
        {
          label: "otherwise",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "otherwise {\n\t${1:// statement}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Fallback otherwise statement block",
          documentation: "Executes if the preceding condition block evaluates to false.",
        },
        {
          label: "loop",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "loop (${1:condition}) {\n\t${2:// statement}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "While loop evaluation block",
          documentation: "Runs the block repeatedly as long as the condition remains true.",
        },
        {
          label: "for",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "for (${1:init}; ${2:condition}; ${3:iteration) {\n\t${4:// statements}\n}}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Structured loop block",
          documentation: "Standard iteration layout supporting initialization, conditions, and steps.",
        },
        
        // --- Built-in Functions ---
        {
          label: "echo",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "echo(${1:value});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Print value to standard output side-by-side",
        },
        {
          label: "echoln",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "echoln(${1:value});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Print value to output and append a newline",
        },
        {
          label: "len",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "len(${1:string});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns number of characters in a string",
        },
        {
          label: "num",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "num(${1:string});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Converts a string string into an integer value",
        },
        {
          label: "str",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "str(${1:integer});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Converts an integer into a string wrapper type",
        },
        {
          label: "upper",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "upper(${1:string});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Converts a target string string to UPPERCASE",
        },
        {
          label: "lower",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "lower(${1:string});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Converts a target string string to lowercase",
        },
        {
          label: "whatIs",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "whatIs(${1:ident});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the data type of passed identifier",
        },
        {
          label: "first",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "first(${1:list});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the first element of a list",
        },
        {
          label: "last",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "last(${1:list});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the last element of a list",
        },
        {
          label: "rest",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "rest(${1:list});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns a copy of the list excluding the first element",
        },
        {
          label: "append",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "append(${1:list},${2:value});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Appends a value to a list and returns the new length",
        },
        {
          label: "drop",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "drop(${1:list});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Removes and returns the last item from a list",
        },
        {
          label: "join",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "join(${1:list},${2:separator});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Joins elements of a list into a string with a separator",
        },
        {
          label: "contains",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "contains(${1:list},${2:value});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Checks if a value exists within a list using strict typing",
        },
        {
          label: "posOf",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "posOf(${1:list},${2:value});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the index of a value in a list, or -1 if not found",
        },
        {
          label: "abs",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "abs(${1:number});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the absolute positive value of a number",
        },
        {
          label: "round",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "round(${1:number});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a floating-point number to the nearest integer",
        },
        {
          label: "floor",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "floor(${1:number});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a number downward to the nearest integer",
        },
        {
          label: "ceil",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "ceil(${1:number});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a number upward to the nearest integer",
        },
        {
          label: "min",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "min(${1:num1},${2:num2});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the smaller of two numeric values",
        },
        {
          label: "max",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "max(${1:num1},${2:num2});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the larger of two numeric values",
        },
        {
          label: "pow",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "pow(${1:base},${2:exponent});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Raises a base number to the power of an exponent",
        },
        {
          label: "abs",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "abs(${1:x});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the absolute (non-negative) value of a number",
        },
        {
          label: "round",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "round(${1:x});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a number to the nearest integer",
        },
        {
          label: "floor",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "floor(${1:x});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a number down to the nearest integer",
        },
        {
          label: "ceil",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "ceil(${1:x});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Rounds a number up to the nearest integer",
        },
        {
          label: "sqrt",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "sqrt(${1:x});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the square root of a non-negative number",
        },
        {
          label: "pow",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "pow(${1:base},${2:exponent});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Raises a base number to the power of an exponent",
        },
        {
          label: "rand",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "rand();",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Generates a random float between 0.0 and 1.0",
        },
        {
          label: "rand (limit)",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "rand(${1:max});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Generates a random integer from 0 up to max (exclusive)",
        },
        {
          label: "rand (range)",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "rand(${1:min},${2:max});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Generates a random integer between min and max (exclusive)",
        },
        {
          label: "rand (range)",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "rand(${1:min},${2:max});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Generates a random integer between min and max (exclusive)",
        },
        {
          label: "reverse",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "reverse(${1:string or list});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns reversed order of a list or a string",
        },

        {
          label: "now",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "now();",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Current Unix timestamp in milliseconds",
        },
        {
          label: "sleep",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "sleep(${1:durationString});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Pause script execution (e.g. \"2s\", \"100ms\")",
        },
        {
          label: "getMs",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getMs(${1:start}, ${2:end});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Total elapsed duration in milliseconds",
        },
        {
          label: "getSec",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getSec(${1:start}, ${2:end});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Elapsed duration in seconds (Float precision)",
        },
        {
          label: "getMin",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getMin(${1:start}, ${2:end});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Elapsed duration in minutes (Float)",
        },
        {
          label: "getHr",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getHr(${1:start}, ${2:end});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Elapsed duration in hours (Float)",
        },
        {
          label: "getYear",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getYear(${1:timestamp});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Extract 4-digit calendar year from ms timestamp",
        },
        {
          label: "getMonth",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getMonth(${1:timestamp});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Extract month digit (1-12) from ms timestamp",
        },
        {
          label: "getDate",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getDate(${1:timestamp});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Extract day element of month (1-31) from timestamp",
        },
        {
          label: "getDay",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "getDay(${1:timestamp});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Extract literal weekday string (e.g. \"Wednesday\")",
        },


        // --- Snippet Boilerplates ---
        {
          label: "bamboo-init",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "bamboo ${1:variableName} = ${2:value};",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Initialize a new structural bamboo assignment block",
          detail: "New Assignment Snippet",
        },
        {
          label: "iff-otherwise",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "iff (${1:condition}) {\n\t${2:// true statement}\n} otherwise {\n\t${3:// false statement}\n}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Complete conditional chain snippet",
          documentation: "Generates a paired iff/otherwise structural block sequence.",
        }
      ];

      return { suggestions: suggestions };
    },
  });
}