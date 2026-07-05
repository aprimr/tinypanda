import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './play.module.css';
import Editor from '@monaco-editor/react';
import { registerTinyPanda } from "../../monaco/registerTinyPanda";

const pkg = require('../../../package.json');

export default function Play() {
  const { colorMode } = useColorMode();
  const editorRef = useRef(null);
  const [output, setOutput] = useState([]);
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const outputBufferRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bootstrapWasm = async () => {
      try {
        if (!window.Go) {
          const script = document.createElement('script');
          script.src = '/binaries/wasm_exec.js'; 
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => (script.onload = resolve));
        }

        const go = new window.Go();
        
        globalThis.fs.writeSync = (fd, buf) => {
          const decoder = new TextDecoder("utf-8");
          const chunk = decoder.decode(buf);
          outputBufferRef.current.push(chunk);
          return buf.length;
        };

        const result = await WebAssembly.instantiateStreaming(
          fetch('/binaries/tinypanda.wasm'), 
          go.importObject
        );
        
        go.run(result.instance);
        setIsWasmReady(true);
        setOutput(["> TinyPanda playground loaded successfully."]);
      } catch (err) {
        console.error("WASM Bootstrapping Failure:", err);
        setOutput([`Playground initialization crashed: ${err.message}`]);
      }
    };

    bootstrapWasm();
  }, []);

  function handleEditorDidMount(editor, monaco) {
    registerTinyPanda(monaco);
    editorRef.current = editor;

    // Track cursor changes to display inside our custom IDE status bar
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });
  }

  const handleRunCode = () => {
    if (!editorRef.current || !isWasmReady) return;

    const sourceCode = editorRef.current.getValue();
    outputBufferRef.current = [];
    setOutput([]); 

    try {
      const finalEvalResult = window.runTinyPanda(sourceCode);
      let completeLog = outputBufferRef.current.join("");

      if (finalEvalResult) {
        completeLog += (completeLog ? "\n" : "") + finalEvalResult;
      }

      if (!completeLog) {
        completeLog = "Executed successfully with no logged outputs.";
      }

      setOutput(completeLog.split('\n'));
    } catch (error) {
      setOutput([`Runtime Compiler Crash: ${error.message}`]);
    }
  };

  return (
    <main className={styles.playgroundContainer}>
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>TinyPanda Playground</h1>
      </div>

      {/* Unified IDE Workspace Frame Container */}
      <div className={`${styles.ideContainer} ${colorMode === 'dark' ? styles.ideDark : styles.ideLight}`}>
        
        {/* Top Strip */}
        <div className={styles.ideHeader}>
          <div className={styles.tabBar}>
            <div className={`${styles.tab} ${styles.tabActive}`}>
              <img src="/img/favicon.ico" alt=".tp image" height="20" />
              <span>main.tp</span>
            </div>
            <div className={styles.tabInactive}>
              <span>README.md</span>
            </div>
          </div>
          
          <button
            className={`${styles.runActionBtn} ${isWasmReady ? styles.runReady : styles.runLoading}`}
            onClick={handleRunCode}
            disabled={!isWasmReady}
          >
            {isWasmReady ? (
                <>Run</>
            ) : (
              <span className={styles.spinner}></span>
            )}
          </button>
        </div>

        <div className={styles.editorBody}>
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="tinypanda"
            theme={colorMode === "dark" ? "tinypanda-dark" : "tinypanda-light"}
            loading="Configuring workspace components..."
            onMount={handleEditorDidMount}
            defaultValue={`echoln("TinyPanda is fun!!!");`}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: true,
              automaticLayout: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "all",

              autoClosingBrackets: "always",
              autoClosingQuotes: "always",  
              autoSurround: "languageDefined", 
              tabSize: 4,
              insertSpaces: true,
              detectIndentation: false,
              matchBrackets: "always",
            }}
          />
        </div>

        {/* Terminal Area */}
        <div className={styles.terminalContainer}>
          <div className={styles.terminalTopbar}>
            <div className={styles.terminalTabs}>
              <span className={styles.activeTerminalTab}>Terminal</span>
            </div>
            <button 
              className={styles.terminalClearAction} 
              onClick={() => setOutput([])}
              disabled={output.length === 0}
            >
              Clear Terminal
            </button>
          </div>
          <div className={styles.terminalViewport}>
            {output.map((line, index) => (
              <div 
                key={index} 
                className={`${styles.terminalRow} ${
                  line.startsWith("Error") || line.startsWith("Woops") || line.startsWith("Runtime") 
                    ? styles.terminalRowError 
                    : line.startsWith(">") 
                    ? styles.terminalRowSystem 
                    : ""
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.resourceFooter}>
        <div className={styles.footerContext}>
          <h3>Want to learn more about TinyPanda?</h3>
          <p>Read through our documentation or download the tinypanda binary.</p>
          <div className={styles.btnActionGroup}>
            <Link className="button button--primary button--lg" to="/docs/intro">Explore Documentation</Link>
            <Link className="button button--secondary button--lg" to="/">Download TinyPanda</Link>
          </div>
        </div>
        <img src="/img/mascot-03.png" alt="TinyPanda Mascot" className={styles.editorMascot}/>
      </section>
    </main>
  );
}