/**
 * Footnote scrolling both from Table and bottom Footnote section
 *
 * Issues addressed:
 * 1. Footnotes hidden behind the fixed navbar when navigating from various parts of the page.
 *
 * Resolution: This script adds appropriate Y-offset when clicking any footnote link format.
 * It ensures the footnote is fully visible by scrolling to a position that accounts for the navbar height,
 * using different navbar heights based on the link format.
 */

document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.querySelector('.main-wrapper') || document.body
  const tableScrollOffset = 85 // Footnote click from inside a Table
  const footnoteScrollOffset = 110 // Footnote click from bottom Footnote section

  mainContent.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && e.target.hash) {
      const hash = e.target.hash.substring(1) // Remove the '#' character
      if (
        hash.includes('user-content-fn') ||
        hash.includes('user-content-fnref') ||
        /^\d+$/.test(hash) ||
        hash.startsWith('fnref')
      ) {
        e.preventDefault()

        const targetElement = document.getElementById(hash)

        if (targetElement) {
          const rect = targetElement.getBoundingClientRect()
          const navbarHeight =
            hash.includes('user-content-fn') ||
            hash.includes('user-content-fnref')
              ? footnoteScrollOffset
              : tableScrollOffset

          if (rect.top < navbarHeight || rect.bottom > window.innerHeight) {
            const scrollPosition = window.pageYOffset + rect.top - navbarHeight
            window.scrollTo({
              top: scrollPosition,
              behavior: 'auto',
            })
          }
        }
      }
    }
  })
})
