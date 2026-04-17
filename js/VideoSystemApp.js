/* Alberto Pérez López-Menchero
   DWEC 06 - VideoSystemApp.js
   Controlador principal de la aplicación.
   Gestión de navegación, formularios UT06, ventanas emergentes y manejo del historial.
*/

import { Model } from './VideoSystemModel.js';
import { View } from './VideoSystemView.js';
import { Movie } from './entities/Movie.js';   // ← IMPORTACIÓN NECESARIA
import { Person } from './entities/Person.js';
import { Category } from './entities/Category.js';


/* ============================
   ESTADO GLOBAL
============================ */
const state = {
  vs: null,
  openWindows: []
};

/* ============================
   ACTIVAR BINDS TRAS CADA RENDER
============================ */
function activateAllBinds() {
  View.bindShowHome(handleShowHome);
  View.bindShowCategory(handleShowCategory);
  View.bindShowProduction(handleShowProduction);
  View.bindShowActors(handleShowActors);
  View.bindShowDirectors(handleShowDirectors);
  View.bindShowActor(handleShowActor);
  View.bindShowDirector(handleShowDirector);

  // UT06
  View.bindShowCreateProduction(handleShowCreateProduction);
  View.bindShowDeleteProduction(handleShowDeleteProduction);
  View.bindShowAssign(handleShowAssign);
}

/* ============================
   HANDLER: INICIO
============================ */
function handleInit() {
  if (!state.vs) {
    const data = Model.createInitialData();
    state.vs = data.vs;
  }

  const cats = Array.from(state.vs.categories);
  View.renderCategories(cats);

  // Pintar producciones en cada categoría (home)
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

function handleShowHome() {
  handleInit();
}

/* ============================
   PRODUCCIONES ALEATORIAS
============================ */
function showRandomProductions(n) {
  const all = Array.from(state.vs.findProductions(() => true));
  const shuffled = all.sort(() => Math.random() - 0.5).slice(0, n);

  View.clearCenter();
  const row = View.renderProductionsRow(shuffled);
  document.getElementById('center').appendChild(row);

  activateAllBinds();
}

function refreshCategoriesMenu() {
  const cats = Array.from(state.vs.categories);
  View.renderCategories(cats);
  activateAllBinds();
}

/* ============================
   CATEGORÍAS
============================ */
function handleShowCategory(name) {
  const category = Array.from(state.vs.categories).find(c => c.name === name);
  const prods = Array.from(state.vs.getProductionsCategory(category));

  View.renderCategoryOnlyWithProductions(category, prods);
  activateAllBinds();
}

/* ============================
   DETALLE DE PRODUCCIÓN
============================ */
function handleShowProduction(title) {
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

/* ============================
   LISTADO DE ACTORES / DIRECTORES
============================ */
function handleShowActors() {
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

function handleShowDirectors() {
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

/* ============================
   DETALLE DE ACTOR / DIRECTOR
============================ */
function handleShowActor(actorString) {
  const [name, lastname] = actorString.split(' ');
  let actor = state.vs.createPerson(name, lastname);
    if (!actor) {
      actor = new Person(name, lastname, new Date(1980, 0, 1));
      state.vs.addActor(actor);
    }


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

  activateAllBinds();

  document.getElementById('open-window-actor')
    .addEventListener('click', () => openActorWindow(actor));
}

function handleShowDirector(directorString) {
  const [name, lastname] = directorString.split(' ');
  let directorObj = state.vs.createPerson(name, lastname);
    if (!directorObj) {
      directorObj = new Person(name, lastname, new Date(1980, 0, 1));
      state.vs.addDirector(directorObj);
    }


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

  activateAllBinds();

  document.getElementById('open-window-director')
    .addEventListener('click', () => openDirectorWindow(director));
}

/* ============================
   FORMULARIO: CREAR PRODUCCIÓN
============================ */
function handleShowCreateProduction() {
  const dirs = Array.from(state.vs.directors);
  const acts = Array.from(state.vs.actors);
  const cats = Array.from(state.vs.categories);

  View.renderCreateProductionForm(dirs, acts, cats);

  document.getElementById("form-create-prod")
    .addEventListener("submit", handleCreateProductionSubmit);
}

function handleCreateProductionSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("prod-title").value.trim();
  const year = parseInt(document.getElementById("prod-year").value);

  const directorName = document.getElementById("prod-director").value;
  const newDirector = document.getElementById("prod-director-new").value.trim();

  const actorNames = [...document.getElementById("prod-actors").selectedOptions].map(o => o.value);
  const newActors = document.getElementById("prod-actors-new").value.split(",").map(a => a.trim()).filter(a => a);

  const catNames = [...document.getElementById("prod-categories").selectedOptions].map(o => o.value);
  const newCats = document.getElementById("prod-categories-new").value.split(",").map(c => c.trim()).filter(c => c);

  if (!title || !year) {
    return showMessage("form-msg", "Todos los campos obligatorios deben completarse", "error");
  }

  const prod = new Movie(title, new Date(year, 0, 1));

  try {
    state.vs.addProduction(prod);

    /* DIRECTOR */
    let directorObj;

    if (newDirector) {
      const [n, l] = newDirector.split(" ");
      directorObj = new Person(n, l, new Date(1980, 0, 1)); // fecha dummy
      state.vs.addDirector(directorObj);
    } else {
      const [n, l] = directorName.split(" ");
      directorObj = state.vs.createPerson(n, l);
    }

    state.vs.assignDirector(directorObj, prod);

    /* ACTORES EXISTENTES */
    for (const a of actorNames) {
      const [n, l] = a.split(" ");
      const actor = state.vs.createPerson(n, l);
      state.vs.assignActor(actor, prod, "Actor");
    }

    /* NUEVOS ACTORES */
    for (const a of newActors) {
      const [n, l] = a.split(" ");
      const actor = new Person(n, l, new Date(1980, 0, 1));
      state.vs.addActor(actor);
      state.vs.assignActor(actor, prod, "Actor");
    }

    /* CATEGORÍAS EXISTENTES */
    for (const c of catNames) {
      const cat = state.vs.createCategory(c);
      state.vs.assignCategory(cat, prod);
    }

    /* NUEVAS CATEGORÍAS */
    for (const c of newCats) {
      const cat = new Category(c);
      state.vs.addCategory(cat);
      state.vs.assignCategory(cat, prod);
      refreshCategoriesMenu();
    }

    showMessage("form-msg", "Producción creada correctamente", "success");

  } catch (e) {
    showMessage("form-msg", "Error: " + e, "error");
  }
}


/* ============================
   FORMULARIO: ELIMINAR PRODUCCIÓN
============================ */
function handleShowDeleteProduction() {
  const prods = Array.from(state.vs.productions);
  View.renderDeleteProductionForm(prods);

  document.getElementById("form-delete-prod")
    .addEventListener("submit", handleDeleteProductionSubmit);
}

function handleDeleteProductionSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("delete-prod-select").value;
  if (!title) {
    return showMessage("form-msg", "Debes seleccionar una producción", "error");
  }

  const prod = state.vs.createProduction(title);
  if (!prod) {
    return showMessage("form-msg", "La producción no existe", "error");
  }

  try {
    state.vs.removeProduction(prod);
    showMessage("form-msg", "Producción eliminada correctamente", "success");
  } catch (e) {
    showMessage("form-msg", "Error: " + e, "error");
  }
}

/* ============================
   FORMULARIO: ASIGNAR / DESASIGNAR
============================ */
function handleShowAssign() {
  const prods = Array.from(state.vs.productions);
  const acts = Array.from(state.vs.actors);
  const dirs = Array.from(state.vs.directors);
  const cats = Array.from(state.vs.categories);   // ← NUEVO

  View.renderAssignForm(prods, acts, dirs, cats); // ← PASAR cats

  document.getElementById("assign-prod")
    .addEventListener("change", loadAssignedData);

  document.getElementById("form-assign")
    .addEventListener("submit", handleAssignSubmit);
}

function loadAssignedData() {
  const title = document.getElementById("assign-prod").value;
  if (!title) return;

  const prod = state.vs.createProduction(title);

  // Actores asignados
  const assignedActors = Array.from(state.vs.getCast(prod))
    .map(obj => `${obj.actor.name} ${obj.actor.lastname1}`);

  document.getElementById("deassign-actors").innerHTML =
    assignedActors.map(a => `<option>${a}</option>`).join('');

  // Directores asignados
  const assignedDirectors = [];

  for (const d of state.vs.directors) {
    for (const p of state.vs.getProductionsDirector(d)) {
      if (p.title === prod.title) assignedDirectors.push(`${d.name} ${d.lastname1}`);
    }
  }

  document.getElementById("deassign-director").innerHTML =
    assignedDirectors.map(d => `<option>${d}</option>`).join('');
}

function handleAssignSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("assign-prod").value;
  if (!title) {
    return showMessage("form-msg", "Debes seleccionar una producción", "error");
  }

  const prod = state.vs.createProduction(title);

  /* ===================== ACTORES ===================== */

  const assignActors = [...document.getElementById("assign-actors").selectedOptions]
    .map(o => o.value);

  const newActors = document.getElementById("assign-actors-new")
    .value.split(",")
    .map(a => a.trim())
    .filter(a => a);

  const deassignActors = [...document.getElementById("deassign-actors").selectedOptions]
    .map(o => o.value);

  /* ===================== DIRECTORES ===================== */

  const assignDirector = document.getElementById("assign-director").value;
  const newDirector = document.getElementById("assign-director-new").value.trim();
  const deassignDirector = document.getElementById("deassign-director").value;

  /* ===================== CATEGORÍAS ===================== */

  const assignCategories = [...document.getElementById("assign-categories").selectedOptions]
    .map(o => o.value);

  const newCategories = document.getElementById("assign-categories-new")
    .value.split(",")
    .map(c => c.trim())
    .filter(c => c);

  try {

    /* ===== ASIGNAR ACTORES EXISTENTES ===== */
    for (const a of assignActors) {
      const [n, l] = a.split(" ");
      let actor = state.vs.createPerson(n, l);
      if (!actor) {
        actor = new Person(n, l, new Date(1980, 0, 1));
        state.vs.addActor(actor);
      }
      state.vs.assignActor(actor, prod, "Actor");
    }

    /* ===== ASIGNAR NUEVOS ACTORES ===== */
    for (const a of newActors) {
      const [n, l] = a.split(" ");
      const actor = new Person(n, l, new Date(1980, 0, 1));
      state.vs.addActor(actor);
      state.vs.assignActor(actor, prod, "Actor");
    }

    /* ===== DESASIGNAR ACTORES ===== */
    for (const a of deassignActors) {
      const [n, l] = a.split(" ");
      let actor = state.vs.createPerson(n, l);
      if (actor) state.vs.deassignActor(actor, prod);
    }

    /* ===== ASIGNAR DIRECTOR EXISTENTE ===== */
    if (assignDirector) {
      const [n, l] = assignDirector.split(" ");
      let dir = state.vs.createPerson(n, l);
      if (!dir) {
        dir = new Person(n, l, new Date(1980, 0, 1));
        state.vs.addDirector(dir);
      }
      state.vs.assignDirector(dir, prod);
    }

    /* ===== ASIGNAR NUEVO DIRECTOR ===== */
    if (newDirector) {
      const [n, l] = newDirector.split(" ");
      const dir = new Person(n, l, new Date(1980, 0, 1));
      state.vs.addDirector(dir);
      state.vs.assignDirector(dir, prod);
    }

    /* ===== DESASIGNAR DIRECTOR ===== */
    if (deassignDirector) {
      const [n, l] = deassignDirector.split(" ");
      let dir = state.vs.createPerson(n, l);
      if (dir) state.vs.deassignDirector(dir, prod);
    }

    /* ===== ASIGNAR CATEGORÍAS EXISTENTES ===== */
    for (const c of assignCategories) {
      const cat = state.vs.createCategory(c);
      state.vs.assignCategory(cat, prod);
    }

    /* ===== ASIGNAR NUEVAS CATEGORÍAS ===== */
    for (const c of newCategories) {
      const cat = new Category(c);
      state.vs.addCategory(cat);
      state.vs.assignCategory(cat, prod);
      refreshCategoriesMenu();
    }

    showMessage("form-msg", "Cambios aplicados correctamente", "success");
    loadAssignedData();

  } catch (e) {
    showMessage("form-msg", "Error: " + e, "error");
  }
}

/* ============================
   MENSAJES
============================ */
function showMessage(id, msg, type) {
  const div = document.getElementById(id);
  div.textContent = msg;
  div.style.color = type === "success" ? "green" : "red";
}

/* ============================
   VENTANAS EMERGENTES
============================ */
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

/* ============================
   HISTORIAL
============================ */
const historyActions = {
  init: () => handleInit(),
  showCategory: event => handleShowCategory(event.state.category),
  showProduction: event => handleShowProduction(event.state.title),
  showActors: () => handleShowActors(),
  showDirectors: () => handleShowDirectors(),
  showActor: event => handleShowActor(event.state.actor),
  showDirector: event => handleShowDirector(event.state.director)
};

window.addEventListener('popstate', event => {
  if (event.state && historyActions[event.state.action]) {
    historyActions[event.state.action](event);
  }
});

/* ============================
   ARRANQUE
============================ */
document.addEventListener('DOMContentLoaded', () => {
  history.replaceState({ action: 'init' }, null);
  handleInit();
});
