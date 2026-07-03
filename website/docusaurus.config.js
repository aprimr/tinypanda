// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
const pkg = require('./package.json');

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TinyPanda',
  tagline: 'A lightweight, dynamically typed programming language.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://tinypanda.com',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'aprimr', // Usually your GitHub org/user name.
  projectName: 'tinypanda', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'new_release',
        content: '<b>TinyPanda v1.0.0 is now live! <a href="/docs/releases" target="_blank" rel="noopener">Check out what\'s new</a>.</b>',
        backgroundColor: '#1DCEAB',
        textColor: '#000',
        isCloseable: false,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },

      navbar: {
        title: 'TinyPanda',
        logo: {
          alt: 'TinyPanda Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            label: 'Docs',
            position: 'right',
          },
          {to: '/playground', label: 'Playground', position: 'right'},
          {to: '/docs/download', label: 'Download', position: 'right'},
          {
            href: 'https://github.com/aprimr/tinypanda',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        links: [
          {
            title: 'TinyPanda',
            items: [
              { label: 'Playground', to: '/playground' },
              { label: 'Download', to: '/docs/download' },
              { label: 'Releases', to: '/docs/download' },
            ],
          },
          {
            title: 'Get Help',
            items: [
              { label: 'Docs', to: '/docs' },
              { label: 'Tutorial', to: '/' },
              { label: 'Examples', to: '/' },
            ],
          },
          {
            title: 'Development ',
            items: [
              { label: 'Source', to: '/playground' },
              { label: 'Report an Issue', to: '/docs/download' },
              { label: 'Contribution', to: '/docs/download' },
            ],
          },
          
        ],
        logo: {
          alt: 'TinyPanda Logo',
          src: 'img/TinyPanda.png',
          height: 22,
        },
        copyright: `
          <div class="footer-copyright-custom">
            <span>© 2026 TinyPanda</span>
            <span>v${pkg.version}</span>
            <span><a href="https://github.com/aprimr" target="_blank" rel="noopener">aprimr</a></span>
          </div>
        `,
      },
      
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
