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
  tagline: 'A dynamically typed, interpreted programming language.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://tinypanda.is-cool.dev',
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
        gtag: {trackingID: 'G-XXXXXXXXXX', anonymizeIP: true,}, // For google analytics
        docs: {
          sidebarPath: './sidebars.js',
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/aprimr/tinypanda/edit/main/website/',
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

      metadata: [
        {name: 'google-site-verification',content: 'YD0sz6k-ClAKt1HHhqfkKr0gCgFggOKxdPrhwTDvocM'},
        {name: 'keywords', content: 'tinypanda, programming language, tinypanda docs, tinypanda playground, open source language'},
      ],

      announcementBar: {
        id: 'announcement_bar',
        content:
          `<span>TinyPanda v${pkg.version} is now live! <b><a href="https://github.com/aprimr/tinypanda/releases/latest">Check out what\'s there</a></b>.</span>`,
        isCloseable: false,
      },
      docs: {
        sidebar: {
          hideable: false,
        },
      },

      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
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
          {to: '/download', label: 'Download', position: 'right'},
          {
          href: "https://github.com/aprimr/tinypanda",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
        ],
      },

      footer: {
        links: [
          {
            title: 'TinyPanda',
            items: [
              { label: 'Playground', to: '/playground' },
              { label: 'Download', to: '/download' },
              { label: 'Releases', href: 'https://github.com/aprimr/tinypanda/releases' },
            ],
          },
          {
            title: 'Get Help',
            items: [
              { label: 'Docs', to: '/docs/intro' },
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
            <span><a href="https://github.com/aprimr/tinypanda/releases" target="_blank" rel="noopener">v${pkg.version} (latest)</a></span>
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
