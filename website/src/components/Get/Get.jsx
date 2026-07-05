import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './get.module.css';

const platforms = [
  {
    id: "macos",
    label: "macOS",
    logo: "mac-inactive",
    logoactive: "mac-active",
    variants: [
      { arch: "Apple Silicon", fileName: "tinypanda-macos-arm64", label: "Download for Apple Silicon" },
      { arch: "Intel", fileName: "tinypanda-macos-amd64", label: "Download for Intel Mac" }
    ],
    steps: [
      <>Identify your chip via <strong>Apple menu &rsaquo; About This Mac</strong>, then download the corresponding binary above.</>,
      <>Open your terminal and make the binary executable: <code className={styles.inlineCode}>chmod +x tinypanda-macos-arm64</code> (or your specific filename).</>,
      <>By default, macOS flags unsigned binaries. To run, go to <strong>System Settings &rsaquo; Privacy & Security</strong>, click <strong>Allow Anyway</strong>, and run: <code className={styles.inlineCode}>./tinypanda-macos-arm64</code></>
    ]
  },
  {
    id: "linux",
    label: "Linux",
    logo: "linux-inactive",
    logoactive: "linux-active",
    variants: [
      { arch: "x86_64", fileName: "tinypanda-linux", label: "Download Linux Binary (x86_64)" }
    ],
    steps: [
      <>Download the core binary architecture matching your build environment using the link above.</>,
      <>Grant execution permissions: <code className={styles.inlineCode}>chmod +x tinypanda-linux</code></>,
      <>Run the executable directly via <code className={styles.inlineCode}>./tinypanda-linux</code>, or move it to a directory in your PATH like <code className={styles.inlineCode}>/usr/local/bin</code> to call it globally.</>
    ]
  },
  {
    id: "windows",
    label: "Windows",
    logo: "win-inactive",
    logoactive: "win-active",
    variants: [
      { arch: "x64", fileName: "tinypanda-windows.exe", label: "Download Windows Binary" }
    ],
    steps: [
      <>Retrieve the executable package <code className={styles.inlineCode}>tinypanda-windows.exe</code> from the direct mirror above.</>,
      <>If Windows SmartScreen triggers an alert, select <strong>"More info"</strong> followed by <strong>"Run anyway"</strong>.</>,
      <>Launch or integrate the tool smoothly inside any terminal instance (Command Prompt or PowerShell) by executing <code className={styles.inlineCode}>tinypanda-windows.exe</code></>
    ]
  }
];

const nextSteps = [
  {
    title: "Read TinyPanda Docs",
    desc: "Explore syntax structure, and internal structures.",
    to: "/docs/intro"
  },
  {
    title: "Try Playground",
    desc: "Write and execute your tinypanda programs live in your browser.",
    to: "/playground"
  },
  {
    title: "Explore TinyPanda Source",
    desc: "Explore source code or submit an issue directly on GitHub.",
    href: "https://github.com/aprimr/tinypanda"
  }
];

export default function Get() {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';
  const [activeId, setActiveId] = useState("macos");

  const active = platforms.find((p) => p.id === activeId) || platforms[0];

  return (
    <main className={styles.page}>
      {/* Hero Header Space */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.title}>Download TinyPanda</h1>
          <p className={styles.subtitle}>Get your environment ready to run programs in seconds.</p>

          <div className={styles.tabRow} role="tablist" aria-label="Choose your operating system">
            {platforms.map((platform) => {
              const isActive = platform.id === activeId;
              return (
                <button
                  key={platform.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  onClick={() => setActiveId(platform.id)}
                >
                  <img 
                    src={`${baseUrl}img/${isActive ? platform.logoactive : platform.logo}.png`} 
                    alt="" 
                    className={styles.tabIcon} 
                  />
                  <span>{platform.label}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.downloadRow}>
            {active.variants.map((variant) => (
              <a
                key={variant.fileName}
                href={`${baseUrl}binaries/${variant.fileName}`}
                download
                className={styles.downloadBtn}
              >
                {variant.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.nextSection}>
        <h2 className={styles.sectionTitle}>What Next?</h2>
        <p className={styles.subtitle}>Read the docs, Try playground or Explore source code.</p>
        <div className={styles.nextGrid}>
          {nextSteps.map((item) => {
            const content = (
              <>
                <div className={styles.nextText}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <span className={styles.nextArrow} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1.33334 12.6667L12.6667 1.33334M12.6667 1.33334H4M12.6667 1.33334V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </>
            );
            return item.href ? (
              <a key={item.title} href={item.href} className={styles.nextCard} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={item.title} to={item.to} className={styles.nextCard}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}