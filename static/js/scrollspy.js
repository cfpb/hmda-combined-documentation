function handleScroll() {
    // array of all h2s
    let headings = ''
    // array of all sidebar links
    let links = ''
    // top sidebar link with no #
    let overview = ''

  if (window.location.pathname == '/documentation/fig/2023/overview') {
    headings = document.querySelectorAll('.docs-version-2023 h2');
    links = document.querySelectorAll('.docs-version-2023 .menu__link')
    overview = document.querySelector('.menu__link[href="/documentation/fig/2023/overview"]')
  } else if (window.location.pathname == '/documentation/fig/2024/overview') {
    headings = document.querySelectorAll('.docs-version-2024 h2')
    links = document.querySelectorAll('.docs-version-2024 .menu__link')
    overview = document.querySelector(
      '.menu__link[href="/documentation/fig/2024/overview"]'
    )
  } else if (window.location.pathname == '/documentation/fig/overview') {
    headings = document.querySelectorAll('.docs-version-2025 h2')
    links = document.querySelectorAll('.docs-version-2025 .menu__link')
    overview = document.querySelector(
      '.menu__link[href="/documentation/fig/overview"]'
    )
  }
  
  if(headings) {
    headings.forEach((heading) => {
      // sidebar link that corresponds to h2
      const link = document.querySelector(`.menu__link[href="#${heading.id}"]`)
  
      // if link is not null
      if (link) {
        // if h2 is in viewport
        if (heading.id && isElementInViewport(heading)) {
          // removes active class from all sidebar links
          links.forEach((activeLink) => {
            activeLink.classList.remove('menu__link--active');
          })
          // adds active class to corresponding sidebar link
          link.classList.add('menu__link--active');
        }
      } 
      // if first h2 (with no #) is in viewport
      else if( window.scrollY == 0 ) {
        // removes active class from all other sidebar links
        links.forEach((activeLink) => {
          if (activeLink.toString() !== overview.toString()) {
            activeLink.classList.remove('menu__link--active');
          }
        })
        // adds active class top sidebar link with no #
        overview.classList.add('menu__link--active');
      }
    });
  }
}

// defines viewport
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// calls handleScroll
document.addEventListener('scroll', handleScroll);
document.addEventListener('DOMContentLoaded', handleScroll);