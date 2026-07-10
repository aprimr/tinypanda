import React from 'react';
import Head from '@docusaurus/Head';
import CodeEditor from '../components/Editor/CodeEditor';

export default function EditorPage() {
  return (
    <>
      <Head>
        <title>TinyPanda Editor</title>
      </Head>
      <CodeEditor />
    </>
  );
}