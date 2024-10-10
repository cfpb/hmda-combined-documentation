// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require('prism-react-renderer/themes/github')
// const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'HMDA Documentation',
  url: 'https://ffiec.cfpb.gov',
  baseUrl: '/documentation/',
  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/documentation/img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  staticDirectories: ['static'],

  customFields: {
    latestFigYear: '2025', // Using key to determine 'latestFigYear' in various places. The key is like a 'env' or const configuration.
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          path: 'documentation',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
        gtag: {
          trackingID: 'GTM-KDGB99D',
          anonymizeIP: false,
        },
      }),
    ],
  ],
  scripts: [
    {
      src: '/documentation/js/uswds-init.min.js',
      defer: true,
    },
    {
      src: '/documentation/js/uswds.min.js',
      defer: true,
    },
    {
      src: '/documentation/js/scrollspy.js',
      defer: true,
    },
    {
      src: '/documentation/js/footnoteScrolling.js',
      defer: true,
    },
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'fig',
        path: 'fig_versioned_docs',
        routeBasePath: '/fig',
        lastVersion: '2025',
        versions: {
          2025: {
            label: '2025',
            path: '2025',
          },
          2024: {
            label: '2024',
            path: '2024',
          },
          2023: {
            label: '2023',
            path: '2023',
          },
          2022: {
            label: '2022',
            path: '2022',
          },
          2021: {
            label: '2021',
            path: '2021',
          },
        },
        includeCurrentVersion: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '69RTFLDVTR',
        // Public API key: it is safe to commit it
        apiKey: 'a9f10b8a29718f165720035309b65a46',
        indexName: 'ffiec-beta-cfpb',
      },
      // prism: {
      //   theme: lightCodeTheme,
      //   darkTheme: darkCodeTheme,
      // },
      docker_tag: process.env.DOCKER_TAG || 'dev',
    }),
}

module.exports = config
