import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

import Hero from '../components/Hero/Hero'
import Showcase from '../components/Showcase/Showcase';
import GetStarted from '../components/GetStarted/GetStarted';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <Hero />

      <main>
        <Showcase />
        <GetStarted />
      </main>
    </Layout>
  );
}
