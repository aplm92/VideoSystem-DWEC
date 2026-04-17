/* Alberto Pérez López-Menchero
  DWEC 05 - VideoSystemApp.js
  Funciones de control de la aplicación, handlers, gestión de ventanas, etc.
*/

import { Model } from './VideoSystemModel.js';
import { View } from './VideoSystemView.js';

const state = {
  vs: null,
  openWindows: []
};

/* ============ REACTIVAR TODOS LOS BINDS DESPUÉS DE CADA RENDER ============ */
function activateAllBinds() {
  View.bindShowHome(handleShowHome);
  View.bindShowCategory(handleShowCategory);
  View.bindShowProduction(handleShowProduction);
  View.bindShowActors(handleShowActors);
  View.bindShowDirectors(handleShowDirectors);
  View.bindShowActor(handleShowActor);
  View.bindShowDirector(handleShowDirector);
}

/* ===================== HANDLERS ===================== */

function handleInit(){
  if (!state.vs) {
    const data = Model.createInitialData();
    state.vs = data.vs;
  }

  const cats = Array.from(state.vs.categories);
  View.renderCategories(cats);

  document.querySelectorAll('#categories-home .category-card').forEach(card => {
    const name = card.querySelector('.category-title').textContent;
    const cat = cats.find(c => c.name === name);
    const prods = Array.from(state.vs.getProductionsCategory(cat));
    const row = View.renderProductionsRow(prods.slice(0, 6));
    card.appendChild(row);
  });

  showRandomProductions(3);
  activateAllBinds();
}

function handleShowHome(){
  handleInit();
}

function showRandomProductions(n) {
  const all = Array.from(state.vs.findProductions(() => true));
  const shuffled = all.sort(() => 0.5 - Math.random()).slice(0, n);
  View.clearCenter();
  const row = View.renderProductionsRow(shuffled);
  document.getElementById('center').appendChild(row);

  activateAllBinds();
}

function handleShowCategory(name){
  const category = Array.from(state.vs.categories).find(c => c.name === name);
  const prods = Array.from(state.vs.getProductionsCategory(category));
  View.renderCategoryOnlyWithProductions(category, prods);

  activateAllBinds();
}

function handleShowProduction(title){
  const prod = state.vs.createProduction(title);
  const cast = Array.from(state.vs.getCast(prod));

  const directors = [];
  for (const d of state.vs.directors) {
    for (const p of state.vs.getProductionsDirector(d)) {
      if (p.title === prod.title) directors.push(d);
    }
  }

  View.renderProductionDetail(prod, cast, directors);
  View.bindOpenWindow(() => openDetailWindow(prod));

  activateAllBinds();
}

function handleShowActors(){
  View.clearCenter();
  const container = document.createElement('div');
  container.innerHTML = '<h2>Actores</h2>';

  for (const a of state.vs.actors) {
    const p = document.createElement('p');
    p.innerHTML = `<span class="link" data-actor="${a.name} ${a.lastname1}">${a.name} ${a.lastname1}</span>`;
    container.appendChild(p);
  }

  document.getElementById('center').appendChild(container);

  activateAllBinds();
}

function handleShowDirectors(){
  View.clearCenter();
  const container = document.createElement('div');
  container.innerHTML = '<h2>Directores</h2>';

  for (const d of state.vs.directors) {
    const p = document.createElement('p');
    p.innerHTML = `<span class="link" data-director="${d.name} ${d.lastname1}">${d.name} ${d.lastname1}</span>`;
    container.appendChild(p);
  }

  document.getElementById('center').appendChild(container);

  activateAllBinds();
}

function handleShowActor(actorString){
  const [name, lastname] = actorString.split(' ');
  const actor = state.vs.createPerson(name, lastname);

  View.clearCenter();
  const div = document.createElement('div');
  div.innerHTML = `
    <h2>${actor.name} ${actor.lastname1}</h2>
    <button id="open-window-actor">Abrir en ventana</button>
    <h3>Filmografía</h3>
  `;

  const ul = document.createElement('ul');

  for (const obj of state.vs.getProductionsActor(actor)) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="link" data-prod="${obj.production.title}">${obj.production.title}</span> — ${obj.role}`;
    ul.appendChild(li);
  }

  div.appendChild(ul);
  document.getElementById('center').appendChild(div);

  // Binds
  activateAllBinds();

  // Botón ventana
  document.getElementById('open-window-actor')
    .addEventListener('click', () => openActorWindow(actor));
}


function handleShowDirector(directorString){
  const [name, lastname] = directorString.split(' ');
  const director = state.vs.createPerson(name, lastname);

  View.clearCenter();
  const div = document.createElement('div');
  div.innerHTML = `
    <h2>${director.name} ${director.lastname1}</h2>
    <button id="open-window-director">Abrir en ventana</button>
    <h3>Filmografía</h3>
  `;

  const ul = document.createElement('ul');

  for (const p of state.vs.getProductionsDirector(director)) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="link" data-prod="${p.title}">${p.title}</span>`;
    ul.appendChild(li);
  }

  div.appendChild(ul);
  document.getElementById('center').appendChild(div);

  // Binds
  activateAllBinds();

  // Botón ventana
  document.getElementById('open-window-director')
    .addEventListener('click', () => openDirectorWindow(director));
}


/* ===================== VENTANAS ===================== */

function openDetailWindow(prod) {
  const w = window.open('', '_blank', 'width=700,height=800');
  if (!w) return alert('Permite popups en el navegador.');

  w.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${prod.title}</title>
        <style>
          body{background:#111;color:#fff;font-family:Arial;padding:20px}
        </style>
      </head>
      <body>
        <h1>${prod.title}</h1>
        <p><strong>Año:</strong> ${prod.publication ? new Date(prod.publication).getFullYear() : ''}</p>
        <p>${prod.synopsis || ''}</p>
      </body>
    </html>
  `);

  state.openWindows.push(w);
}

function openActorWindow(actor) {
  const w = window.open('', '_blank', 'width=600,height=500');
  if (!w) return alert('Permite popups en el navegador.');

  w.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${actor.name} ${actor.lastname1}</title>
        <style>
          body{background:#111;color:#fff;font-family:Arial;padding:20px}
        </style>
      </head>
      <body>
        <h1>${actor.name} ${actor.lastname1}</h1>
        <p><strong>Fecha de nacimiento:</strong> ${actor.born.toLocaleDateString()}</p>
      </body>
    </html>
  `);

  state.openWindows.push(w);
}

function openDirectorWindow(director) {
  const w = window.open('', '_blank', 'width=600,height=500');
  if (!w) return alert('Permite popups en el navegador.');

  w.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${director.name} ${director.lastname1}</title>
        <style>
          body{background:#111;color:#fff;font-family:Arial;padding:20px}
        </style>
      </head>
      <body>
        <h1>${director.name} ${director.lastname1}</h1>
        <p><strong>Fecha de nacimiento:</strong> ${director.born.toLocaleDateString()}</p>
      </body>
    </html>
  `);

  state.openWindows.push(w);
}

document.getElementById('close-windows')?.addEventListener('click', () => {
  for (const w of state.openWindows) {
    try { w.close(); } catch {}
  }
  state.openWindows = [];
});

/* ===================== HISTORY ===================== */

const historyActions = {
  init: () => handleInit(),
  showCategory: (event) => handleShowCategory(event.state.category),
  showProduction: (event) => handleShowProduction(event.state.title),
  showActors: () => handleShowActors(),
  showDirectors: () => handleShowDirectors(),
  showActor: (event) => handleShowActor(event.state.actor),
  showDirector: (event) => handleShowDirector(event.state.director)
};

window.addEventListener('popstate', (event) => {
  if (event.state && historyActions[event.state.action]) {
    historyActions[event.state.action](event);
  }
});

/* ===================== ARRANQUE ===================== */

document.addEventListener('DOMContentLoaded', () => {
  history.replaceState({ action: 'init' }, null);
  handleInit();
});
