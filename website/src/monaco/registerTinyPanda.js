import { tinypandaLanguage } from "./tinypandaLanguage";
import {
  tinypandaDarkTheme,
  tinypandaLightTheme,
} from "./tinypandaTheme";

export function registerTinyPanda(monaco) {
  const languageId = "tinypanda";

  // 1. Core Registration
  if (!monaco.languages.getLanguages().some((lang) => lang.id === languageId)) {
    monaco.languages.register({ id: languageId });
  }

  monaco.languages.setMonarchTokensProvider(languageId, tinypandaLanguage);
  monaco.editor.defineTheme("tinypanda-dark", tinypandaDarkTheme);
  monaco.editor.defineTheme("tinypanda-light", tinypandaLightTheme);

  // 2. Pair Config (Fixes auto-closing brackets and quotes)
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

  // 3. Autocomplete / IntelliSense Configuration
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
          label: "what",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "what(${1:ident});",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "Returns the data type of passed identifier",
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