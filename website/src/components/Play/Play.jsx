import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './play.module.css';
import Editor from '@monaco-editor/react'
import { registerTinyPanda } from "../../monaco/registerTinyPanda";
const pkg = require('../../../package.json');

export default function Play() {
  const { colorMode } = useColorMode();

  function handleEditorDidMount(editor, monaco) {
    registerTinyPanda(monaco);
  }
  return (
    <main className={styles.playgroundContainer}>
      <h1 className={styles.mainTitle}>Try TinyPanda</h1>
      <Editor
        height="400px"
        width="100%"
        defaultLanguage="tinypanda"
        theme={colorMode === "dark" ? "tinypanda-dark" : "tinypanda-light"}
        loading="Loading TinyPanda Editor..."
        onMount={handleEditorDidMount}
        defaultValue={`echoln("I love TinyPanda");`}
      />

      <section className={styles.linksSection}>
        <img src="/img/mascot-03.png" alt="TinyPanda mascot" className={styles.mascot}/>
        <h3>Want to learn more about TinyPanda?</h3>
        <div className={styles.linkButtonsGroup}>
          <Link className="button button--primary button--lg" to="/docs/intro">Read the Docs</Link>
          <Link className="button button--secondary button--lg" to="/">Download TinyPanda <span>v{pkg.version}</span></Link>
        </div>
      </section>
    </main>
  );
}