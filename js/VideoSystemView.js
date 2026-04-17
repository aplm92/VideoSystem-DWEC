/* Alberto Pérez López-Menchero
  DWEC 05 - VideoSystemView.js
  Funciones de renderizado, gestión del DOM, etc.
*/

const EXCECUTE_HANDLER = Symbol('excecuteHandler');

export const View = (() => {

  const categoriesHome = document.getElementById('categories-home');
  const center = document.getElementById('center');
  const categoriesMenu = document.getElementById('categories-menu');

  return {

    [EXCECUTE_HANDLER](handler, handlerArguments, scrollElement, data, url, event) {
      handler(...handlerArguments);
      const scroll = document.querySelector(scrollElement);
      if (scroll) scroll.scrollIntoView();
      history.pushState(data, null, url);
      event.preventDefault();
    },

    clearCenter(){ center.innerHTML = ''; },
    clearCategoriesHome(){ categoriesHome.innerHTML = ''; },

    renderCategories(categories){
      this.clearCategoriesHome();
      categoriesMenu.innerHTML = '';

      for(const c of categories){
        const card = document.createElement('div');
        card.className = 'category-card';

        const title = document.createElement('h3');
        title.className = 'category-title';
        title.textContent = c.name;
        title.dataset.category = c.name;
        card.appendChild(title);

        const row = document.createElement('div');
        row.className = 'category-row';
        card.appendChild(row);

        categoriesHome.appendChild(card);

        const menuLink = document.createElement('a');
        menuLink.href = '#';
        menuLink.className = 'nav-link category-link';
        menuLink.dataset.category = c.name;
        menuLink.textContent = c.name;
        categoriesMenu.appendChild(menuLink);
      }
    },

    // IMPORTANTE: aquí ya NO añadimos listeners, solo pintamos
    renderProductionsRow(productions){
      const row = document.createElement('div');
      row.className = 'category-row';
      for(const p of productions){
        const pc = document.createElement('div');
        pc.className = 'prod-card';
        pc.dataset.title = p.title;
        pc.innerHTML = `<img src="${p.image || 'https://picsum.photos/300/420?random=' + Math.floor(Math.random()*1000)}" alt="${p.title}">
                        <div class="meta"><strong>${p.title}</strong><div>${p.publication ? new Date(p.publication).getFullYear() : ''}</div></div>`;
        row.appendChild(pc);
      }
      return row;
    },

    renderProductionDetail(prod, cast, directors){
      this.clearCenter();
      const d = document.createElement('div');
      d.className = 'detail';
      d.innerHTML = `<h2>${prod.title} <small>${prod.publication ? new Date(prod.publication).getFullYear() : ''}</small></h2>
                     <p>${prod.synopsis || ''}</p>
                     <h4>Reparto</h4><ul id="cast-list"></ul>
                     <h4>Directores</h4><ul id="dir-list"></ul>
                     <button id="open-window">Abrir en ventana</button>`;
      center.appendChild(d);

      const castList = d.querySelector('#cast-list');
      for(const c of cast) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="link" data-actor="${c.actor.name} ${c.actor.lastname1}">${c.actor.name} ${c.actor.lastname1}</span> — ${c.role}`;
        castList.appendChild(li);
      }

      const dirList = d.querySelector('#dir-list');
      for(const dr of directors){
        const li = document.createElement('li');
        li.innerHTML = `<span class="link" data-director="${dr.name} ${dr.lastname1}">${dr.name} ${dr.lastname1}</span>`;
        dirList.appendChild(li);
      }
    },

    renderCategoryOnlyWithProductions(category, productions) {
      categoriesHome.innerHTML = '';
      center.innerHTML = '';

      const container = document.createElement('div');
      container.className = 'category-selected';

      const title = document.createElement('h2');
      title.textContent = category.name;
      title.className = 'selected-category-title';
      container.appendChild(title);

      const row = document.createElement('div');
      row.className = 'category-row selected-row';

      for (const p of productions) {
        const pc = document.createElement('div');
        pc.className = 'prod-card';
        pc.dataset.title = p.title;
        pc.innerHTML = `<img src="${p.image || 'https://picsum.photos/300/420?random=' + Math.floor(Math.random()*1000)}" alt="${p.title}">
                        <div class="meta"><strong>${p.title}</strong><div>${p.publication ? new Date(p.publication).getFullYear() : ''}</div></div>`;
        row.appendChild(pc);
      }

      container.appendChild(row);
      center.appendChild(container);
    },

    /* ====================== BINDS ====================== */

    bindOpenWindow(handler){
      const btn = document.getElementById('open-window');
      if (!btn) return;
      btn.addEventListener('click', handler);
    },

    bindShowHome(handler){
      document.querySelectorAll('[data-route="home"]').forEach(el => {
        el.addEventListener('click', (event) => {
          this[EXCECUTE_HANDLER](
            handler,
            [],
            'body',
            { action: 'init' },
            '/',
            event
          );
        });
      });
    },

    bindShowCategory(handler){
      document.querySelectorAll('.category-title, .category-link').forEach(el => {
        el.addEventListener('click', (event) => {
          const name = el.dataset.category;
          this[EXCECUTE_HANDLER](
            handler,
            [name],
            '#center',
            { action: 'showCategory', category: name },
            `/category/${encodeURIComponent(name)}`,
            event
          );
        });
      });
    },

    // Aquí enganchamos tanto las cards como los enlaces de filmografía
    bindShowProduction(handler){
      document.querySelectorAll('.prod-card, .link[data-prod]').forEach(el => {
        el.addEventListener('click', (event) => {
          const title = el.dataset.title || el.dataset.prod;
          this[EXCECUTE_HANDLER](
            handler,
            [title],
            '#center',
            { action: 'showProduction', title },
            `/production/${encodeURIComponent(title)}`,
            event
          );
        });
      });
    },

    bindShowActors(handler){
      document.querySelectorAll('.nav-link[data-route="actors"]').forEach(a => {
        a.addEventListener('click', (event) => {
          this[EXCECUTE_HANDLER](
            handler,
            [],
            '#center',
            { action: 'showActors' },
            '/actors',
            event
          );
        });
      });
    },

    bindShowDirectors(handler){
      document.querySelectorAll('.nav-link[data-route="directors"]').forEach(a => {
        a.addEventListener('click', (event) => {
          this[EXCECUTE_HANDLER](
            handler,
            [],
            '#center',
            { action: 'showDirectors' },
            '/directors',
            event
          );
        });
      });
    },

    bindShowActor(handler){
      document.querySelectorAll('.link[data-actor]').forEach(el => {
        el.addEventListener('click', (event) => {
          const actor = el.dataset.actor;
          this[EXCECUTE_HANDLER](
            handler,
            [actor],
            '#center',
            { action: 'showActor', actor },
            `/actor/${encodeURIComponent(actor)}`,
            event
          );
        });
      });
    },

    bindShowDirector(handler){
      document.querySelectorAll('.link[data-director]').forEach(el => {
        el.addEventListener('click', (event) => {
          const director = el.dataset.director;
          this[EXCECUTE_HANDLER](
            handler,
            [director],
            '#center',
            { action: 'showDirector', director },
            `/director/${encodeURIComponent(director)}`,
            event
          );
        });
      });
    }

  };

})();
