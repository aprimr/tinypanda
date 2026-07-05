import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import Link from '@docusaurus/Link';
import Get from '../components/Get/Get';


export default function Download() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Download"
      description="Download TinyPanda binary"
    >
      <Get />
    </Layout>
  );
}
