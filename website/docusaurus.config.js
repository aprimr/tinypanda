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

  url: 'https://tinypanda.netlify.app',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'aprimr', // Usually your GitHub org/user name.
  projectName: 'tinypanda', // Usually your repo name.

  onBrokenLinks: 'warn',

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
        id: 'announcement_bar',
        content:
          '<span>TinyPanda v1.0.0 is now live! <b><a href="/docs/releases">Check out what\'s there</a></b>.</span>',
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
          {to: '/', label: 'Playground', position: 'right'},
          {to: '/', label: 'Download', position: 'right'},
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
              { label: 'Playground', to: '/' },
              { label: 'Download', to: '/' },
              { label: 'Releases', href: 'https://github.com/aprimr/tinypanda/releases' },
            ],
          },
          {
            title: 'Get Help',
            items: [
              { label: 'Docs', to: '/' },
              { label: 'Tutorial', to: '/' },
              { label: 'Examples', to: '/' },
            ],
          },
          {
            title: 'Development ',
            items: [
              { label: 'Source', href: 'https://github.com/aprimr/tinypanda' },
              { label: 'Report an Issue', href: 'https://github.com/aprimr/tinypanda/issues' },
              { label: 'Contribution', href: 'https://github.com/aprimr/tinypanda/pulls' },
            ],
          },
          
        ],
        logo: {
          src: 'img/mascot-01.svg',
          alt: "TinyPanda mascot",
          height: 36,
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

    stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap',
      type: 'text/css',
    },
  ],
};

export default config;
