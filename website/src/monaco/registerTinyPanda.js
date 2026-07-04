import { tinypandaLanguage } from "./tinypandaLanguage";
import {
  tinypandaDarkTheme,
  tinypandaLightTheme,
} from "./tinypandaTheme";

export function registerTinyPanda(monaco) {
  monaco.languages.register({
    id: "tinypanda",
  });

  monaco.languages.setMonarchTokensProvider(
    "tinypanda",
    tinypandaLanguage
  );

  monaco.editor.defineTheme(
    "tinypanda-dark",
    tinypandaDarkTheme
  );

  monaco.editor.defineTheme(
    "tinypanda-light",
    tinypandaLightTheme
  );
}