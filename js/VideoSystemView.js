/* Alberto Pérez López-Menchero
   DWEC 06 - VideoSystemView.js
   Funciones de renderizado, gestión del DOM, etc.
   Se añade formulario de creación y eliminación de producciones, 
   asignación/desasignación de actores y directores.
*/

const EXCECUTE_HANDLER = Symbol('executeHandler');

export const View = (() => {

  const categoriesHome = document.getElementById('categories-home');
  const center = document.getElementById('center');
  const categoriesMenu = document.getElementById('categories-menu');

  return {

    /* ============================
       EJECUCIÓN DE HANDLERS + HISTORIAL
    ============================ */
    [EXCECUTE_HANDLER](handler, handlerArguments, scrollElement, data, url, event) {
      handler(...handlerArguments);

      const scroll = document.querySelector(scrollElement);
      if (scroll) scroll.scrollIntoView();

      history.pushState(data, null, url);
      event.preventDefault();
    },

    /* ============================
       LIMPIEZA DE ZONAS
    ============================ */
    clearCenter() { center.innerHTML = ''; },
    clearCategoriesHome() { categoriesHome.innerHTML = ''; },

    /* ============================
       CATEGORÍAS
    ============================ */
    renderCategories(categories) {
      this.clearCategoriesHome();
      categoriesMenu.innerHTML = '';

      for (const c of categories) {
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

    /* ============================
       FILAS DE PRODUCCIONES
    ============================ */
    renderProductionsRow(productions) {
      const row = document.createElement('div');
      row.className = 'category-row';

      for (const p of productions) {
        const pc = document.createElement('div');
        pc.className = 'prod-card';
        pc.dataset.title = p.title;

        pc.innerHTML = `
          <img src="${p.image || 'https://picsum.photos/300/420?random=' + Math.floor(Math.random() * 1000)}" alt="${p.title}">
          <div class="meta">
            <strong>${p.title}</strong>
            <div>${p.publication ? new Date(p.publication).getFullYear() : ''}</div>
          </div>
        `;

        row.appendChild(pc);
      }

      return row;
    },

    /* ============================
       DETALLE DE PRODUCCIÓN
    ============================ */
    renderProductionDetail(prod, cast, directors) {
      this.clearCenter();

      const d = document.createElement('div');
      d.className = 'detail';

      d.innerHTML = `
        <h2>${prod.title} <small>${prod.publication ? new Date(prod.publication).getFullYear() : ''}</small></h2>
        <p>${prod.synopsis || ''}</p>

        <h4>Reparto</h4>
        <ul id="cast-list"></ul>

        <h4>Directores</h4>
        <ul id="dir-list"></ul>

        <button id="open-window">Abrir en ventana</button>
      `;

      center.appendChild(d);

      const castList = d.querySelector('#cast-list');
      for (const c of cast) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="link" data-actor="${c.actor.name} ${c.actor.lastname1}">
            ${c.actor.name} ${c.actor.lastname1}
          </span> — ${c.role}
        `;
        castList.appendChild(li);
      }

      const dirList = d.querySelector('#dir-list');
      for (const dr of directors) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="link" data-director="${dr.name} ${dr.lastname1}">
            ${dr.name} ${dr.lastname1}
          </span>
        `;
        dirList.appendChild(li);
      }
    },

    /* ============================
       CATEGORÍA SELECCIONADA
    ============================ */
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

        pc.innerHTML = `
          <img src="${p.image || 'https://picsum.photos/300/420?random=' + Math.floor(Math.random() * 1000)}" alt="${p.title}">
          <div class="meta">
            <strong>${p.title}</strong>
            <div>${p.publication ? new Date(p.publication).getFullYear() : ''}</div>
          </div>
        `;

        row.appendChild(pc);
      }

      container.appendChild(row);
      center.appendChild(container);
    },

    /* ============================
       FORMULARIO: CREAR PRODUCCIÓN
    ============================ */
    renderCreateProductionForm(directors, actors, categories) {
      center.innerHTML = `
        <h2>Nueva producción</h2>

        <form id="form-create-prod">

          <label>Título</label>
          <input type="text" id="prod-title" required>

          <label>Año</label>
          <input type="number" id="prod-year" required>

          <!-- DIRECTOR -->
          <label>Director existente</label>
          <select id="prod-director">
            ${directors.map(d => `<option>${d.name} ${d.lastname1}</option>`).join('')}
          </select>

          <label>Nuevo director (opcional)</label>
          <input type="text" id="prod-director-new" placeholder="Nombre Apellido">

          <!-- ACTORES -->
          <label>Actores existentes</label>
          <select id="prod-actors" multiple>
            ${actors.map(a => `<option>${a.name} ${a.lastname1}</option>`).join('')}
          </select>

          <label>Nuevos actores (separados por coma)</label>
          <input type="text" id="prod-actors-new" placeholder="Ej: Ana López, Juan Pérez">

          <!-- CATEGORÍAS -->
          <label>Categorías existentes</label>
          <select id="prod-categories" multiple>
            ${categories.map(c => `<option>${c.name}</option>`).join('')}
          </select>

          <label>Nuevas categorías (separadas por coma)</label>
          <input type="text" id="prod-categories-new" placeholder="Ej: Terror, Suspense">

          <button type="submit">Crear</button>
        </form>

        <div id="form-msg"></div>
      `;
    },

    /* ============================
       FORMULARIO: ELIMINAR PRODUCCIÓN
    ============================ */
    renderDeleteProductionForm(productions) {
      center.innerHTML = `
        <h2>Eliminar producción</h2>

        <form id="form-delete-prod">
          <label>Selecciona una producción</label>
          <select id="delete-prod-select" required>
            <option value="">-- Selecciona --</option>
            ${productions.map(p => `<option>${p.title}</option>`).join('')}
          </select>

          <button type="submit">Eliminar</button>
        </form>

        <div id="form-msg"></div>
      `;
    },

    /* ============================
       FORMULARIO: ASIGNAR / DESASIGNAR
    ============================ */

    renderAssignForm(productions, actors, directors, categories) {
      center.innerHTML = `
        <h2>Asignar / Desasignar</h2>

        <form id="form-assign">

          <label>Producción</label>
          <select id="assign-prod" required>
            <option value="">-- Selecciona --</option>
            ${productions.map(p => `<option>${p.title}</option>`).join('')}
          </select>

          <h3>Actores</h3>

          <label>Asignar actores existentes</label>
          <select id="assign-actors" multiple>
            ${actors.map(a => `<option>${a.name} ${a.lastname1}</option>`).join('')}
          </select>

          <label>Nuevos actores (separados por coma)</label>
          <input type="text" id="assign-actors-new" placeholder="Ej: Ana López, Juan Pérez">

          <label>Desasignar actores</label>
          <select id="deassign-actors" multiple></select>

          <h3>Directores</h3>

          <label>Asignar director existente</label>
          <select id="assign-director">
            <option value="">-- Ninguno --</option>
            ${directors.map(d => `<option>${d.name} ${d.lastname1}</option>`).join('')}
          </select>

          <label>Nuevo director (opcional)</label>
          <input type="text" id="assign-director-new" placeholder="Nombre Apellido">

          <label>Desasignar director</label>
          <select id="deassign-director"></select>

          <h3>Categorías</h3>

          <label>Asignar categorías existentes</label>
          <select id="assign-categories" multiple>
            ${categories.map(c => `<option>${c.name}</option>`).join('')}
          </select>

          <label>Nuevas categorías (separadas por coma)</label>
          <input type="text" id="assign-categories-new" placeholder="Ej: Terror, Suspense">

          <button type="submit">Aplicar cambios</button>
        </form>

        <div id="form-msg"></div>
      `;
    },

    /* ============================
       BINDS
    ============================ */
    bindOpenWindow(handler) {
      const btn = document.getElementById('open-window');
      if (btn) btn.addEventListener('click', handler);
    },

    bindShowHome(handler) {
      document.querySelectorAll('[data-route="home"]').forEach(el => {
        el.addEventListener('click', event => {
          this[EXCECUTE_HANDLER](handler, [], 'body', { action: 'init' }, '/', event);
        });
      });
    },

    bindShowCategory(handler) {
      document.querySelectorAll('.category-title, .category-link').forEach(el => {
        el.addEventListener('click', event => {
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

    bindShowProduction(handler) {
      document.querySelectorAll('.prod-card, .link[data-prod]').forEach(el => {
        el.addEventListener('click', event => {
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

    bindShowActors(handler) {
      document.querySelectorAll('.nav-link[data-route="actors"]').forEach(a => {
        a.addEventListener('click', event => {
          this[EXCECUTE_HANDLER](handler, [], '#center', { action: 'showActors' }, '/actors', event);
        });
      });
    },

    bindShowDirectors(handler) {
      document.querySelectorAll('.nav-link[data-route="directors"]').forEach(a => {
        a.addEventListener('click', event => {
          this[EXCECUTE_HANDLER](handler, [], '#center', { action: 'showDirectors' }, '/directors', event);
        });
      });
    },

    bindShowActor(handler) {
      document.querySelectorAll('.link[data-actor]').forEach(el => {
        el.addEventListener('click', event => {
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

    bindShowDirector(handler) {
      document.querySelectorAll('.link[data-director]').forEach(el => {
        el.addEventListener('click', event => {
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
    },

    bindShowCreateProduction(handler) {
      document.querySelectorAll('[data-route="create-production"]').forEach(el => {
        el.addEventListener('click', handler);
      });
    },

    bindShowDeleteProduction(handler) {
      document.querySelectorAll('[data-route="delete-production"]').forEach(el => {
        el.addEventListener('click', handler);
      });
    },

    bindShowAssign(handler) {
      document.querySelectorAll('[data-route="assign"]').forEach(el => {
        el.addEventListener('click', handler);
      });
    }

  };

})();
