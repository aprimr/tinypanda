import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './play.module.css';
import Editor from '@monaco-editor/react';
import { registerTinyPanda } from "../../monaco/registerTinyPanda";

const pkg = require('../../../package.json');

const DEFAULT_TP_CODE = `bamboo name = "TinyPanda";\nbamboo repoLink = "github.com/aprimr/tinypanda";\n\necholn(name + " is fun!!!");\nbamboo sayhello = fn(x) {\n\techoln("Hello ", x);\n\treturn "Star " + name + " at "+ repoLink;\n};\n\nbamboo msg = sayhello(name);\necholn(msg);`;

const DEFAULT_README = `=========
TinyPanda
=========

A small interpreted programming language written in Go.

License:     MIT
Repository:  github.com/aprimr/tinypanda
----------------------------------------

This playground runs a WebAssembly build of the TinyPanda
interpreter directly in your browser. No servers so your code executes completely locally in milliseconds!

Getting started
---------------
1. Switch to the main.tp tab.
2. Write or edit your TinyPanda code.
3. Press Run to execute it and see the output in the terminal below.

This file is just a notes tab. It is not executed when you
press Run.
`;

export default function Play() {
  const { colorMode } = useColorMode();
  const editorRef = useRef(null);
  const [output, setOutput] = useState([]);
  const [isWasmReady, setIsWasmReady] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const outputBufferRef = useRef([]);

  const [activeFile, setActiveFile] = useState('main.tp');
  const [tpCode, setTpCode] = useState(DEFAULT_TP_CODE);
  const [readmeCode, setReadmeCode] = useState(DEFAULT_README);

  const isMainActive = activeFile === 'main.tp';
  const currentValue = isMainActive ? tpCode : readmeCode;
  const currentLanguage = isMainActive ? 'tinypanda' : 'plaintext';

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
                reject(new Error("wasm_exec.js downloaded but window.Go is still undefined. Check script integrity!"));
              } else {
                resolve();
              }
            };
            
            script.onerror = () => reject(new Error("Failed to download script from /binaries/wasm_exec.js"));
            document.body.appendChild(script);
          });
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
        setOutput(["> TinyPanda intrepreter loaded successfully."]);
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

  function handleEditorChange(value) {
    if (isMainActive) {
      setTpCode(value ?? '');
    } else {
      setReadmeCode(value ?? '');
    }
  }

  const handleRunCode = () => {
    if (!isWasmReady || !isMainActive) return;

    const sourceCode = tpCode;
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

  const isRunDisabled = !isWasmReady || !isMainActive;

  return (
    <main className={styles.playgroundContainer}>
      <div className={styles.titleArea}>
        <h1 className={styles.mainTitle}>TinyPanda Playground</h1>
      </div>

      {/* IDE Container */}
      <div className={`${styles.ideContainer} ${colorMode === 'dark' ? styles.ideDark : styles.ideLight}`}>
        
        {/* Top Strip */}
        <div className={styles.ideHeader}>
          <div className={styles.tabBar}>
            <div
              className={`${styles.tab} ${isMainActive ? styles.tabActive : styles.tabInactive}`}
              onClick={() => setActiveFile('main.tp')}
            >
              <img src="/img/favicon.ico" alt=".tp file" height="20" />
              <span>main.tp</span>
            </div>
            <div
              className={`${styles.tab} ${!isMainActive ? styles.tabActive : styles.tabInactive}`}
              onClick={() => setActiveFile('README.txt')}
            >
              <span>README.txt</span>
            </div>
          </div>
          
          <button
            className={`${styles.runActionBtn} ${isWasmReady && isMainActive ? styles.runReady : styles.runLoading}`}
            onClick={handleRunCode}
            disabled={isRunDisabled}
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
            path={activeFile}
            language={currentLanguage}
            value={currentValue}
            theme={colorMode === "dark" ? "tinypanda-dark" : "tinypanda-light"}
            loading="Configuring workspace components..."
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
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
            <Link className="button button--secondary button--lg" to="/download">Download TinyPanda</Link>
          </div>
        </div>
        <img src="/img/mascot-03.png" alt="TinyPanda Mascot" className={styles.editorMascot}/>
      </section>
    </main>
  );
}