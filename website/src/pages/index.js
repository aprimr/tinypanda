import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

import Hero from '../components/Hero/Hero'
import Showcase from '../components/Showcase/Showcase';
import GetStarted from '../components/Getstarted/Getstarted';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <Hero />

      <main>
        <Showcase />
        <GetStarted />
      </main>
    </Layout>
  );
}
