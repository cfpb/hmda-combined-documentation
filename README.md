# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Testing - Cypress

[Cypress](https://www.cypress.io/) is used to perform end-to-end testing for all interactions a user will experience when browsing HMDA documentation. It mimicks a user's interaction with the site and allows for rapid, automated system validation of project deployments.

#### End-to-End Testing

Run tests via cli: `yarn run cypress run`
<br />
Run tests via Cypress UI: `yarn run cypress open`

### Search + Newely Added/Updating Documentation

Search feature is powered by [Algolia](https://www.algolia.com/) via the [DocSearch](https://docsearch.algolia.com/) program.

#### Adding new documentation or updating existing documentation

Section explains how to properly update the Algolia crawler to pick up documentation changes.

1. Navigate to https://crawler.algolia.com/admin/users/login and Login
2. Head over to the `Overview` navigation tab, once there click the `Restart Crawling` button and that will trigger a re-crawl and update the searchable documentation for Algolia

### Swizzled Components

The following components have been [swizzled](https://docusaurus.io/docs/swizzling) and are now manually maintained:
- Navbar (./src/theme/Navbar)
- SearchBar (./src/theme/SearchBar)
- Footer (./src/theme/Footer)
- DocVersionBanner (./src/theme/DocVersionBanner)

The ```Navbar``` and ```Footer``` components are from the [USWDS v3.0](https://designsystem.digital.gov/whats-new/updates/2022/04/28/introducing-uswds-3-0/) and are independent from the Docusaurus theme. They can be edited manually and updating docusaurus shouldn't affect these components.

To update links in the Navbar, edit the ```links.js``` (./src/theme/Navbar/Content/links.js) file.

To update the styling of the ```Navbar``` and ```Footer```:
1. Run ```npx gulp watch``` in a new terminal window
1. Edit the ```_uswds-theme-custom-styles.scss``` (src/theme/Navbar/uswds/scss/_uswds-theme-custom-styles.scss)
1. Every time you save the scss file it will automatically be compiled

The ```SearchBar``` component has a slightly modified CSS (./src/theme/SearchBar/styles.css) file and may need to be "re-swizzled" when upgrading docusaurus to a new version.

### Filing Instructions Guide (FIG)

#### To add a new version/year of the FIG:

1. Go to ```/fig_versioned_docs``` and duplicate the folder of the most recent version (```version-2025```). Name this new folder with the current year (```version-2026```)
2. Go to ```/fig_versioned_sidebars``` and duplicate the .json file for the most recent version (```version-2025-sidebards.json```). Name this new file with the same year used in step 1 (```version-2026-sidebars.json```)
3. Go to ```/fig_versions.json``` and add the year for the new FIG to the top of the array ("2026").
4. Update the content in the following:
> - FIG: ```/fig_versioned_docs/version-2026/overview.mdx```
> - Sidebar: ```/fig_versioned_sidebars/version-2026-sidebars.json```
<br /><br />
The ```items``` in the ```version-2026-sidebars.json``` should correlate to the ```H2 Headings ( ## )``` in the ```/version-2026/overview.mdx``` file:

```
overview.mdx:

## 2. Changes to the Submission Process for Data Collected in 2026 {#changes}
```

```
version-2026-sidebars.json:

    "items": [
        {
          "type": "link",
          "href": "/fig/2026/overview#changes",
          "label": "2. Changes for 2026"
        },      
     ]
```

5. Update the Docusaurus `scrollspy.js` and `custom.scss` file to support latest FIG release

> `scrollspy` file helps Docusaurus determine the highlighted scrolling
> `custom.scss` file styles the left sidebar as the user scrolls

> - Navigate to /static/js/scrollspy.js file and add the new version to the object.

```javascript
  // Define a mapping of years to their respective classes
  const yearClasses = {
    2021: 'docs-version-2021',
    2022: 'docs-version-2022',
    2023: 'docs-version-2023',
    2024: 'docs-version-2024',
    2025: 'docs-version-2025', // 2025 is considered the latest
  }
```

> - Navigate to `/src/css/custom.scss` and add the latest FIG release css class

```css
.docs-version-2025, .docs-version-2024, .docs-version-2023, .docs-version-2022, .docs-version-2021 {
  // Add latest FIG version year
}
```

6. Update navigation menu for linking to the FIG

> - Navigation to `/src/theme/Navbar/Content/links.js`

```javascript
{
    submenu: [
      {
        name: 'Filing Instructions Guide',
        href: `/documentation/fig/2024/overview`, // Link to update
      },
      
    ],
}
```

7. Update the Algolia Search Crawler
> - Log in to ```https://crawler.algolia.com/``` and select the 'Editor'
> > - FIG versions have the year in the URL: ```https://ffiec.cfpb.gov/documentation/fig/{year}/overview``` .
> - In the Actions array, update the ```pathsToMatch``` of the entry with ```pageRank: "100"``` to be the the URL of the FIG version you want ranked the highest. In this example, search results for 2024 will be returned first:
```javascript
    {
        indexName: "*****-****-cfpb",
        pathsToMatch: ["https://ffiec.cfpb.gov/documentation/fig/2024/overview"],
        recordExtractor: ({ $, helpers }) => {
            ...
            return helpers.docsearch({
                recordProps: {
                    ...
                    pageRank: "100",
                },
                ...
            });
        },
    },
```
> - The latest FIG is released a year ahead of annualy filing season. Therefore the search results for the latest FIG need to be lower priority. The ```pageRank: "5"``` key helps lower the priority when a user is searching FIG related results. In this example, the search results for the latest released version (2025) will be returned with a low priority.
```javascript
    {
      indexName: "*****-****-cfpb",
      pathsToMatch: ["https://ffiec.cfpb.gov/documentation/fig/2025/overview"],
      recordExtractor: ({ $, helpers }) => {
        ...
        return helpers.docsearch({
          recordProps: {
            ...
            pageRank: "5",
          },
          ...
        });
      },
    },
```
> - Older FIGs ( 2022 and older ) are listed in the  ```pathsToMatch``` with ```pageRank: "1"```. In this example, search results for the 2022 and 2021 FIG will be returned last:
```javascript
    {
      indexName: "*****-****-cfpb",
      pathsToMatch: [
        "https://ffiec.cfpb.gov/documentation/fig/2022/**",
        "https://ffiec.cfpb.gov/documentation/fig/2021/**",
      ],
      recordExtractor: ({ $, helpers }) => {
        ...
        return helpers.docsearch({
          recordProps: {
            ...
            pageRank: "1",
          },
          ...
        });
      },
    },
```
> - Go to the ```Overview``` page and click the ```Restart Crawling``` button to re-index the site. All new search results should be displayed in Algolia Search form on the frontend.

### Supplemental Guide for Quarterly Filers

The supplemnental guide for quarterly file file lives under `fig_versioned_docs` -> `version-{year}` folder called `supplemental-guide-for-quarterly-filers.mdx`.

The version log JSON for supplemnental guide for quarterly filers lives under `fig_versioned_docs` -> `version-{year}` -> `tables` -> `SupplementalGuide` folder.

#### How to add new year

1. Copy the file called `supplemental-guide-for-quarterly-filers.mdx` from the previous year (2025) and add it to the `fig_versioned_docs` -> `version-{year}`
2. The version log file will need to be created and updated, it contains the new changes that years supplemental guide.
3. Work with the BAs to update the content of the new supplemental guide (changes are minor from year to year).
4. Add the new supplemental guide link to the new `version-{year}-sidebars.json` found under `fig_versioned_sidebars` folder. Updates to the previous years `version-{year}-sidebars.json` files will need to be updated to contain the new link.

```json
{
      "type": "category",
      "label": "Supplemental Guides for Quarterly Filers",
      "collapsed": true,
      "items": [
        { // If latest supplemental guide make it type: doc
          "type": "doc",
          "id": "supplemental-guide-for-quarterly-filers",
          "label": "2025 Supplemental Guide for Quarterly Filers"
        },
        { // Linking to older supplemental guides are type: link
          "type": "link",
          "label": "2024 Supplemental Guide for Quarterly Filers",
          "href": "/fig/2024/supplemental-guide-for-quarterly-filers"
        },
      ]
    }
```

### Updating Graphics and Diagrams

Instructions for updating the [timeline graphics](https://ffiec.cfpb.gov/documentation/faq/data-collection-timelines) can be found on our [internal wiki](https://[GHE]/HMDA-Operations/hmda-devops/wiki/Graphics-&-Diagrams).
