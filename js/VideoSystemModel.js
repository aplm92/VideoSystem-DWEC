/* ============================================================
   VideoSystemModel.js — UT07
   Alberto Pérez López-Menchero
   Gestión del modelo + carga inicial JSON + exportación backup
============================================================ */

import { VideoSystem } from './core/VideoSystem.js';
import { Category } from './entities/Category.js';
import { Person } from './entities/Person.js';
import { Movie } from './entities/Movie.js';
import { Production } from './entities/Production.js';
import { VideoSystemException } from './exceptions/VideoSystemException.js';

export const Model = (() => {

  const vs = VideoSystem.getInstance('MiVideo');

  /* ============================================================
     UT07 — CARGA INICIAL DESDE JSON
  ============================================================ */
  async function createInitialData() {
    const response = await fetch("server/data.json");
    const data = await response.json();

    /* ============================
       1. CATEGORÍAS
    ============================ */
    for (const c of data.categories) {
      const cat = new Category(c.name, c.description);
      vs.addCategory(cat);
    }

    /* ============================
       2. DIRECTORES
    ============================ */
    for (const d of data.directors) {
      const dir = new Person(d.name, d.lastname1, new Date(d.born));
      vs.addDirector(dir);
    }

    /* ============================
       3. ACTORES
    ============================ */
    for (const a of data.actors) {
      const actor = new Person(a.name, a.lastname1, new Date(a.born));
      vs.addActor(actor);
    }

    /* ============================
       4. PRODUCCIONES
    ============================ */
    for (const p of data.productions) {
      const prod = new Movie(p.title, new Date(p.year, 0, 1));
      prod.lat = p.lat;
      prod.lng = p.lng;
      prod.synopsis = p.synopsis || "";
      vs.addProduction(prod);
    }

    /* ============================
       5. RELACIONES
    ============================ */

    // Categorías → Producciones
    for (const rel of data.assignments.categories) {
      const cat = vs.createCategory(rel.category);
      const prods = rel.productions.map(t => vs.createProduction(t));
      vs.assignCategory(cat, ...prods);
    }

    // Actores → Producciones
    for (const rel of data.assignments.actors) {
      const actor = vs.createPerson(rel.actor.name, rel.actor.lastname1);
      const prod = vs.createProduction(rel.production);
      vs.assignActor(actor, prod, rel.role);
    }

    // Directores → Producciones
    for (const rel of data.assignments.directors) {
      const director = vs.createPerson(rel.director.name, rel.director.lastname1);
      const prods = rel.productions.map(t => vs.createProduction(t));
      vs.assignDirector(director, ...prods);
    }

    return { vs };
  }

  /* ============================================================
     UT07 — EXPORTACIÓN DE DATOS PARA BACKUP
  ============================================================ */
  function exportData() {
    return {
      categories: [...vs.categories].map(c => ({
        name: c.name,
        description: c.description
      })),

      directors: [...vs.directors].map(d => ({
        name: d.name,
        lastname1: d.lastname1,
        born: d.born
      })),

      actors: [...vs.actors].map(a => ({
        name: a.name,
        lastname1: a.lastname1,
        born: a.born
      })),

      productions: [...vs.productions].map(p => ({
        title: p.title,
        year: p.publication.getFullYear(),
        lat: p.lat,
        lng: p.lng,
        synopsis: p.synopsis || ""
      })),

      assignments: {
        categories: [...vs.categories].map(cat => ({
          category: cat.name,
          productions: [...vs.getProductionsCategory(cat)].map(p => p.title)
        })),

        actors: [...vs.actors].flatMap(actor =>
          [...vs.getProductionsActor(actor)].map(obj => ({
            actor: { name: actor.name, lastname1: actor.lastname1 },
            production: obj.production.title,
            role: obj.role
          }))
        ),

        directors: [...vs.directors].map(dir => ({
          director: { name: dir.name, lastname1: dir.lastname1 },
          productions: [...vs.getProductionsDirector(dir)].map(p => p.title)
        }))
      }
    };
  }

  /* ============================================================
     API PÚBLICA DEL MODELO
  ============================================================ */
  return {
    createInitialData,
    exportData
  };

})();
