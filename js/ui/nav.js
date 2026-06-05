/**
 * Navigation Component
 * Shared navigation bar for all pages
 */

const Nav = (() => {
  /**
   * Renders the navigation bar
   * @param {string} activePage - Current page identifier
   * @returns {string} HTML string
   */
  function render(activePage) {
    const t = Language.t;

    const navItems = [
      { id: 'home', label: t('nav.home'), href: '/index.html' },
      { id: 'catalog', label: t('nav.catalog'), href: '/catalog.html' },
      { id: 'checker', label: t('nav.checker'), href: '/checker.html' },
      { id: 'learning', label: t('nav.learning'), href: '/learning.html' },
      { id: 'examples', label: t('nav.examples'), href: '/examples.html' },
      { id: 'reference', label: t('nav.reference'), href: '/reference.html' },
    ];

    const navLinks = navItems.map(item => {
      const activeClass = item.id === activePage ? ' active' : '';
      return `<a href="${item.href}" class="nav-link${activeClass}">${item.label}</a>`;
    }).join('\n        ');

    const currentLang = Language.getLanguage();
    const langNpActive = currentLang === 'np' ? ' active' : '';
    const langEnActive = currentLang === 'en' ? ' active' : '';

    return `
    <nav class="navbar">
      <div class="container navbar-inner">
        <a href="/index.html" class="navbar-brand">
          <div>
            <div class="navbar-brand-text">छन्द कविता मार्गदर्शक</div>
            <div class="navbar-brand-text-en">Chhanda Kavita Guide</div>
          </div>
        </a>

        <div class="navbar-nav">
          ${navLinks}
        </div>

        <div class="navbar-actions">
          <div class="lang-toggle">
            <button class="lang-toggle-btn${langNpActive}" onclick="Language.setLanguage('np'); location.reload();">नेपाली</button>
            <button class="lang-toggle-btn${langEnActive}" onclick="Language.setLanguage('en'); location.reload();">English</button>
          </div>
        </div>
      </div>
    </nav>`;
  }

  /**
   * Injects navigation into a page
   * @param {string} activePage
   */
  function inject(activePage) {
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
      placeholder.outerHTML = render(activePage);
    }
  }

  return {
    render,
    inject,
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.Nav = Nav;
}
