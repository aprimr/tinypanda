import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

import Play from '../components/Play/Play';

export default function Playground() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="TinyPanda Interactive Playground"
      description="Write and run TinyPanda code directly in your browser. No installation required. Explore syntax, run scripts, and experiment with code."
      keywords={['tinypanda playground', 'tinypanda language', 'tinypadna interpreter', 'try tinypanda', 'tinypanda interpreted language']}
    >
      <Play />
    </Layout>
  );
}
