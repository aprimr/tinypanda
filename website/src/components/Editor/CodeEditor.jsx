import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, ChevronDown, ChevronUp, CheckCircle2, Sun, Moon, GitBranch, Check } from 'lucide-react';
import { registerTinyPanda } from '../../monaco/registerTinyPanda';
import styles from './codeeditor.module.css';

const DEFAULT_TP_CODE = `bamboo name = "TinyPanda";
bamboo year =  2026;
bamboo isReady = true;

echoln(name);
echoln(whatIs(name));

echoln(year);
echoln(whatIs(year));

echoln(isReady);
echoln(whatIs(isReady));`;

const THEME_STORAGE_KEY = 'tinypanda-editor-theme';

export default function CodeEditor() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const runHandlerRef = useRef(() => {});
  const outputBufferRef = useRef([]);

  const [code, setCode] = useState(DEFAULT_TP_CODE);
  const [output, setOutput] = useState([]);
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bootstrapWasm = async () => {
      try {
        if (!window.Go) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/binaries/wasm_exec.js';
            script.async = true;
            script.onload = () => {
              if (typeof window.Go === 'undefined') {
                reject(new Error('wasm_exec.js loaded but window.Go is undefined.'));
              } else {
                resolve();
              }
            };
            script.onerror = () => reject(new Error('Failed to load /binaries/wasm_exec.js'));
            document.body.appendChild(script);
          });
        }

        const go = new window.Go();

        globalThis.fs.writeSync = (fd, buf) => {
          const decoder = new TextDecoder('utf-8');
          outputBufferRef.current.push(decoder.decode(buf));
          return buf.length;
        };

        const result = await WebAssembly.instantiateStreaming(
          fetch('/binaries/tinypanda.wasm'),
          go.importObject
        );

        go.run(result.instance);
        setIsWasmReady(true);
        setOutput(['Interpreter ready.']);
      } catch (err) {
        console.error('WASM bootstrap failed:', err);
        setOutput([`Failed to load interpreter: ${err.message}`]);
      }
    };

    bootstrapWasm();
  }, []);

  const handleRunCode = useCallback(() => {
    if (!isWasmReady) return;

    outputBufferRef.current = [];
    setIsRunning(true);
    setTerminalCollapsed(false);

    try {
      const result = window.runTinyPanda(code);
      let log = outputBufferRef.current.join('');
      if (result) log += (log ? '\n' : '') + result;
      setOutput(log ? log.split('\n') : ['(no output)']);
    } catch (err) {
      setOutput([`Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  }, [code, isWasmReady]);

  useEffect(() => {
    runHandlerRef.current = handleRunCode;
  }, [handleRunCode]);

  function handleEditorDidMount(editor, monaco) {
    registerTinyPanda(monaco);
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runHandlerRef.current();
    });
  }

  return (
    <div className={`${styles.app} ${isDark ? styles.dark : styles.light}`}>
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div className={styles.titleText}>TinyPanda Editor</div>
        <div className={styles.titleBarSpacer}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {/* Editor + terminal column */}
        <div className={styles.editorColumn}>
          <div className={styles.tabBar}>
            <div className={styles.tab}>
              <span className={styles.tabDotUnsaved} />
              <span>main.tp</span>
            </div>
            <div className={styles.tabBarSpacer} />
            <button
              className={styles.runButton}
              onClick={handleRunCode}
              disabled={!isWasmReady || isRunning}
              title="Run (Ctrl+Enter)"
            >
              <Play size={12} fill="currentColor" />
              <span>{isRunning ? 'Running…' : isWasmReady ? 'Run' : 'Loading…'}</span>
            </button>
          </div>

          <div className={styles.editorPane}>
            <Editor
              height="100%"
              width="100%"
              path="main.tp"
              language="tinypanda"
              value={code}
              theme={isDark ? 'tinypanda-dark' : 'tinypanda-light'}
              loading="Loading editor…"
              onMount={handleEditorDidMount}
              onChange={(value) => setCode(value ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                renderLineHighlight: 'all',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoSurround: 'languageDefined',
                tabSize: 4,
                insertSpaces: true,
                detectIndentation: false,
                matchBrackets: 'always',
                padding: { top: 0 },
              }}
            />
          </div>

          {/* Terminal */}
          <div className={`${styles.terminal} ${terminalCollapsed ? styles.terminalCollapsed : ''}`}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalTabs}>
                <span className={styles.terminalTabActive}>TERMINAL</span>
              </div>
              <div className={styles.terminalActions}>
                <button
                  className={styles.terminalIconBtn}
                  onClick={() => setOutput([])}
                  disabled={output.length === 0}
                  title="Clear terminal"
                  aria-label="Clear terminal"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  className={styles.terminalIconBtn}
                  onClick={() => setTerminalCollapsed((c) => !c)}
                  title={terminalCollapsed ? 'Expand terminal' : 'Collapse terminal'}
                  aria-label="Toggle terminal"
                >
                  {terminalCollapsed ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            </div>
            {!terminalCollapsed && (
              <div className={styles.terminalViewport}>
                {output.map((line, i) => (
                  <div
                    key={i}
                    className={`${styles.terminalRow} ${
                      /^error/i.test(line) ? styles.terminalRowError : ''
                    }`}
                  >
                    <span className={styles.terminalPrompt}>$ </span> {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusItem}>
            {isWasmReady ? <Check size={13} /> : null}{' '}
            {isWasmReady ? 'Interpreter ready' : 'Loading interpreter…'}
          </span>
        </div>
        <div className={styles.statusRight}>
          <span className={styles.statusItem}>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span className={styles.statusItem}>Spaces: 4</span>
          <span className={styles.statusItem}>TinyPanda</span>
        </div>
      </div>
    </div>
  );
}