(function () {
  let componentsPromise;

  const componentMap = [
    { id: 'header', url: './html/layout/header.html' },
    { id: 'component-hero', url: './html/sections/hero.html' },
    { id: 'component-about', url: './html/sections/about.html' },
    { id: 'component-work', url: './html/sections/work.html' },
    { id: 'component-services', url: './html/sections/services.html' },
    { id: 'component-testimonials', url: './html/sections/testimonial.html' },
    { id: 'component-barbers', url: './html/sections/team.html' },
    { id: 'component-contact', url: './html/sections/contato.html' },
    { id: 'footer', url: './html/layout/footer.html' }
  ];

  function dispatchComponentsLoaded() {
    window.dispatchEvent(new CustomEvent('components:loaded'));
  }

  async function loadComponent(targetId, sourceUrl) {
    const target = document.getElementById(targetId);

    if (!target) {
      console.error(`Component target "#${targetId}" was not found.`);
      return false;
    }

    try {
      const response = await fetch(sourceUrl, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Failed to load ${sourceUrl}: ${response.status}`);
      }

      const html = await response.text();
      target.innerHTML = html;
      return true;
    } catch (error) {
      console.error(error);
      target.innerHTML = '<p>Não foi possível carregar este conteúdo.</p>';
      return false;
    }
  }

  function startLoadingComponents() {
    if (!componentsPromise) {
      const batches = componentMap.map(({ id, url }) => loadComponent(id, url));
      componentsPromise = Promise.all(batches).then(dispatchComponentsLoaded);
    }

    return componentsPromise;
  }

  function loadComponents() {
    if (document.readyState === 'loading') {
      return new Promise((resolve) => {
        document.addEventListener(
          'DOMContentLoaded',
          () => resolve(startLoadingComponents()),
          { once: true }
        );
      });
    }

    return startLoadingComponents();
  }

  window.ComponentLoader = {
    loadComponent,
    loadComponents
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents, { once: true });
  } else {
    loadComponents();
  }
})();
