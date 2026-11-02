function handleScroll() {
  const path = window.location.pathname

  // array of all h2s
  let headings = ''
  // array of all sidebar links
  let links = ''
  // top sidebar link with no #
  let overview = ''

  // Define a mapping of years to their respective classes
  const yearClasses = {
    2021: 'docs-version-2021',
    2022: 'docs-version-2022',
    2023: 'docs-version-2023',
    2024: 'docs-version-2024',
    2025: 'docs-version-2025',
    2026: 'docs-version-2026',
    2027: 'docs-version-2027', // 2027 is considered the latest
  }

  // Check if the path matches the pattern for FIG overview pages
  const yearMatch = path.match(/^\/documentation\/fig\/((\d{4})\/)?overview$/)

  if (yearMatch) {
    const year = yearMatch[2]
    const className = yearClasses[year]

    if (className) {
      headings = document.querySelectorAll(`.${className} h2`)
      links = document.querySelectorAll(`.${className} .menu__link`)
      overview = document.querySelector(
        `.menu__link[href="/documentation/fig/${year}/overview"]`
      )
    }
  } else if (path.includes('supplemental-guide-for-quarterly-filers')) {
    // Handle the supplemental guide page
    links = document.querySelectorAll('.menu__link')
    clearAllHighlights(links) // Clear any highlighted FIG links

    const pathParts = path.split('/')

    // Find the year in the path parts
    const year = pathParts.find(part => /^\d{4}$/.test(part))

    // Construct the href with the year included
    const supplementalGuideHref = `/documentation/fig/${year}/supplemental-guide-for-quarterly-filers`

    const supplementalGuideLink = document.querySelector(
      `.menu__link[href="${supplementalGuideHref}"]`
    )

    if (supplementalGuideLink) {
      supplementalGuideLink.classList.add('menu__link--active')
    }

    return // Exit the function early as we don't need to process headings
  }

  if (headings) {
    headings.forEach(heading => {
      // Get the current path
      const currentPath = path

      // sidebar link that corresponds to h2
      const link = document.querySelector(
        `.menu__link[href="${currentPath}#${heading.id}"]`
      )

      // if link is not null
      if (link) {
        // if h2 is in viewport
        if (heading.id && isElementInViewport(heading)) {
          // removes active class from all sidebar links
          links.forEach(activeLink => {
            activeLink.classList.remove('menu__link--active')
          })
          // adds active class to corresponding sidebar link
          link.classList.add('menu__link--active')
        }
      }
      // if first h2 (with no #) is in viewport
      else if (window.scrollY == 0) {
        // removes active class from all other sidebar links
        links.forEach(activeLink => {
          if (activeLink.toString() !== overview.toString()) {
            activeLink.classList.remove('menu__link--active')
          }
        })
        // adds active class top sidebar link with no #
        overview.classList.add('menu__link--active')
      }
    })
  }
}

function clearAllHighlights(links) {
  // removes active class from all sidebar links
  links.forEach(activeLink => {
    activeLink.classList.remove('menu__link--active')
  })
}

// defines viewport
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// calls handleScroll
document.addEventListener('scroll', handleScroll)
document.addEventListener('DOMContentLoaded', handleScroll)
