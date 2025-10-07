const { HOST } = Cypress.env()

const DOCS_DEFAULT_URL = `${HOST}/documentation/category/frequently-asked-questions`
const FIG_DOCS_DEFAULT_URL = `${HOST}/documentation/fig/2026/overview` // Takes user to most current FIG document
const CURRENT_FIG_YEAR = '2025'
const LATEST_FIG_YEAR = '2025'

describe('General Checks', () => {
  it('Government banner is displayed and image is visible', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get('.usa-banner__header').then(banner => {
      Cypress.dom.isVisible(banner)
    })
    // Images loads
    cy.get('.usa-banner__header-flag')
      .should('be.visible')
      .and($img => {
        // "naturalWidth" and "naturalHeight" are set when the image loads
        expect(
          $img[0].naturalWidth,
          'image has natural width'
        ).to.be.greaterThan(0)
      })
  })
})

describe('Docusaurus user interactions', () => {
  beforeEach(() => {
    cy.viewport(1125, 1000)
  })
  it('Redirect from "/documentation/" to the docs/faq page', () => {
    cy.visit(`${HOST}/documentation/`)
    cy.location().should(loc => {
      expect(loc.href).to.eq(DOCS_DEFAULT_URL)
    })
  })
  it('Interaction with category card and category navbar', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get(':nth-child(1) > .card').click()
    cy.wait(1000)
    cy.location().should(loc => {
      expect(loc.href).to.eq(
        `${HOST}/documentation/faq/data-collection-timelines`
      )
    })
    // Confirm user navigates to document
    cy.get('h1').contains('HMDA Data Collection Timelines')
    // Testing category navbar
    cy.get(':nth-child(2) > .breadcrumbs__link').click()
    cy.location().should(loc => {
      expect(loc.href).to.eq(DOCS_DEFAULT_URL)
    })
  })
  it('Interacts with table of contents on single doc', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get(':nth-child(1) > .card').click()
    cy.wait(1000)
    cy.get(':nth-child(2) > .table-of-contents__link').click()
    cy.location().should(loc => {
      expect(loc.href).to.eq(
        `${HOST}/documentation/faq/data-collection-timelines#filing-instructions-guide-fig`
      )
    })
    cy.get('#annual-filing-period-dates').contains('Annual Filing Period Dates')
  })
})

describe('Algolia user interactions', () => {
  beforeEach(() => {
    cy.viewport(1025, 1000)
  })

  it('Opens Algolia search box and looks up documentation on HMDA Maps', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get('.DocSearch').click()
    cy.get('#docsearch-input').type('hmda maps')
    cy.get('#docsearch-hits0-item-0 > a').contains('HMDA Maps')
    cy.get('#docsearch-hits0-item-0 > a').click({force: true})
    cy.location().should(loc => {
      expect(loc.href).to.eq(`${HOST}/documentation/faq/data-browser-maps-faq`)
    })
    cy.get('h1').contains('HMDA Maps')
  })
  it('Visits sub section of the HMDA Maps document', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get('.DocSearch').click()
    cy.get('#docsearch-input').type('hmda maps')
    cy.get('#docsearch-hits0-item-2 > a').contains('option')
    cy.get('#docsearch-hits0-item-2 > a').click({force: true})
    cy.location().should(loc => {
      expect(loc.href).to.eq(`${HOST}/documentation/faq/data-browser-maps-faq#what-does-each-option-mean`)
    })
    cy.get('#what-does-each-option-mean').contains('option')
  })
  it('Visit the more results page provived by Algolia', () => {
    cy.visit(DOCS_DEFAULT_URL)
    cy.get('.DocSearch').click()
    cy.get('#docsearch-input').type('hmda maps')
    cy.get('.DocSearch-HitsFooter > a').click()
    cy.wait(1000)
    cy.get(':nth-child(1) > [class^=searchResultItemHeading] a').first().click()
    cy.location().should(loc => {
      expect(loc.href).to.eq(`${HOST}/documentation/faq/data-browser-maps-faq`)
    })
    cy.get('h1').contains('HMDA Maps')
  })
})

describe('Covers Filing Instructions Guide (FIG) interactions', () => {
  beforeEach(() => {
    cy.viewport(1025, 1000)
  })

  it('Ensures the latest FIG is live', () => {
    cy.visit(FIG_DOCS_DEFAULT_URL)
    const year = FIG_DOCS_DEFAULT_URL.match(/\/(\d+)\/overview/)[1]
    cy.get('h1').contains(year)
  })
  it('Searches for an answer on the 2023 FIG through Algolia', () => {
    cy.visit(`${HOST}/documentation/fig/2023/overview`)
    cy.get('.DocSearch').click()
    cy.get('#docsearch-input').type('2023 Loan/Application Register format')
    cy.get('.DocSearch-Hit-source').invoke('remove') // Remove the HMTL element that is blocking Cypress from clicking
    cy.get('#docsearch-hits0-item-0 > a > .DocSearch-Hit-Container')
      .contains('Loan/Application Register format')
      .click()
    cy.get('[id^=33--loanapplication-register-format]').contains('Loan/Application Register')
  })
  it('Navigates to FIG year (2023) and ensures 2023 version is properly displayed and allows navigation to the latest FIG via the banner link', () => {
    cy.visit(`${HOST}/documentation/fig/2023/overview`)
    cy.wait(1000)
    cy.get('.theme-doc-version-banner').contains(
      'This is the 2023 Filing Instructions Guide for data collected in 2023.'
    )
    cy.get('b > a').click()
    cy.wait(1000)
    cy.url().should(
      'eq',
      `${HOST}/documentation/fig/${LATEST_FIG_YEAR}/overview`
    )
  })
})