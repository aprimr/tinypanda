import React from 'react';
import styles from './showcase.module.css';
import Link from '@docusaurus/Link';

export default function Showcase() {
  return (
    <section className={styles.showcase}>
      <div className="container">
        <div className={styles.imageWrapper}>
          <img src="/img/extension.png" alt=".tp logo" className={styles.logo} />

          <img 
            src="/img/code-snippet.svg" 
            alt="Tiny Panda" 
            className={styles.image} 
          />
        </div>

        <div className={styles.buttonContainer}>
          <Link className="button button--secondary button--lg" to="/playground">
            Try it now!
          </Link>
        </div>
      </div>
    </section>
  );
}