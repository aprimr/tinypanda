import React from 'react';
import styles from './GetStarted.module.css';
const pkg = require('../../../package.json');

export default function GetStarted() {
  return (
    <section className={styles.getStarted}>
      <div className={styles.container}>
        {/* Get Started */}
        <div className={styles.colLeft}>
          <h2 className={styles.heading}>Get started with Tiny Panda</h2>
          <p className={styles.subtext}>Download the latest version of TinyPanda</p>
          <div className={styles.actions}>
            <a href="/download" className={styles.secondaryLink}>Download v{pkg.version} (latest)</a>
          </div>
        </div>

        {/* Panda Mascot */}
        <div className={styles.colRight}>
          <img 
            src="/img/mascot-00.png" 
            alt="TinyPanda Mascot" 
            className={styles.mascotImage} 
          />
        </div>
      </div>
    </section>
  );
}