"use strict";

import { VideoSystem } from "../core/VideoSystem.js";
import { Category } from "../entities/Category.js";
import { Movie } from "../entities/Movie.js";
import { Serie } from "../entities/Serie.js";
import { Person } from "../entities/Person.js";
import { User } from "../entities/User.js";
import { Resource } from "../entities/Resource.js";
import { VideoSystemException } from "../exceptions/VideoSystemException.js";

/* =====================================================
   FUNCIÓN DE TESTEO COMPLETA
===================================================== */

function testVideoSystem() {

  console.log("========== TEST VIDEO SYSTEM ==========");

  /* ===================== SINGLETON ===================== */
  const vs1 = VideoSystem.getInstance("MyStreaming");
  const vs2 = VideoSystem.getInstance("OtroNombre");
  console.log("Singleton OK:", vs1 === vs2);

  /* ===================== USERS ===================== */
  console.log("\n--- USERS ---");

  const u1 = new User("juan", "juan@mail.com", "123456");
  const u2 = new User("ana", "ana@mail.com", "abcdef");

  vs1.addUser(u1, u2);

  console.log("Usuarios registrados:");
  for (const u of vs1.users) console.log(" -", u.username);

  vs1.removeUser(u2);
  console.log("Usuarios tras eliminar uno:");
  for (const u of vs1.users) console.log(" -", u.username);

  /* ===================== CATEGORIES ===================== */
  console.log("\n--- CATEGORIES ---");

  const drama = vs1.createCategory("Drama");
  const action = vs1.createCategory("Acción");

  for (const c of vs1.categories) console.log(" -", c.name);

  /* ===================== PRODUCTIONS ===================== */
  console.log("\n--- PRODUCTIONS ---");

  const r1 = new Resource(120, "/matrix.mp4");
  const r2 = new Resource(45, "/lost_s01e01.mp4");

  const matrix = new Movie("Matrix", new Date(1999, 2, 31), r1);
  matrix.addLocation("Los Ángeles");

  const lost = new Serie("Lost", new Date(2004, 8, 22), 6);
  lost.addResource(r2);
  lost.addLocation("Hawái");

  vs1.addProduction(matrix, lost);

  for (const p of vs1.productions) console.log(" -", p.title);

  /* ===================== ACTORS & DIRECTORS ===================== */
  console.log("\n--- ACTORS & DIRECTORS ---");

  const keanu = new Person("Keanu", "Reeves", new Date(1964, 8, 2));
  const matthew = new Person("Matthew", "Fox", new Date(1966, 6, 14));
  const lana = new Person("Lana", "Wachowski", new Date(1965, 5, 21));

  vs1.addActor(keanu, matthew);
  vs1.addDirector(lana);

  console.log("Actores:");
  for (const a of vs1.actors) console.log(" -", a.toString());

  console.log("Directores:");
  for (const d of vs1.directors) console.log(" -", d.toString());

  /* ===================== ASSIGN ===================== */
  console.log("\n--- ASSIGN ---");

  vs1.assignCategory(drama, matrix, lost);
  vs1.assignCategory(action, matrix);

  vs1.assignDirector(lana, matrix);

  vs1.assignActor(keanu, matrix, "Neo");
  vs1.assignActor(matthew, lost, "Jack Shepard");

  console.log("Producciones Drama:");
  for (const p of vs1.getProductionsCategory(drama))
    console.log(" -", p.title);

  console.log("Producciones del director:");
  for (const p of vs1.getProductionsDirector(lana))
    console.log(" -", p.title);

  console.log("Producciones del actor Keanu:");
  for (const obj of vs1.getProductionsActor(keanu))
    console.log(" -", obj.production.title, "como", obj.role);

  console.log("Reparto de Matrix:");
  for (const c of vs1.getCast(matrix))
    console.log(" -", c.actor.toString(), "como", c.role);

  /* ===================== FILTERS ===================== */
  console.log("\n--- FILTERS ---");

  console.log("Producciones posteriores a 2000:");
  for (const p of vs1.findProductions(
    p => p.publication.getFullYear() > 2000
  )) {
    console.log(" -", p.title);
  }

  console.log("Producciones Drama:");
  for (const p of vs1.filterProductionsInCategory(
    drama,
    p => p.title.length > 0
  )) {
    console.log(" -", p.title);
  }

  /* ===================== REMOVE ===================== */
  console.log("\n--- REMOVE ---");

  vs1.removeActor(keanu);
  console.log("Reparto de Matrix tras eliminar actor:");
  for (const c of vs1.getCast(matrix))
    console.log(" -", c.actor.toString());

  vs1.removeDirector(lana);
  console.log("Directores tras eliminar uno:");
  for (const d of vs1.directors)
    console.log(" -", d.toString());

  console.log("Eliminando producción Lost...");
  vs1.removeProduction(lost);

  console.log("Producciones tras eliminar Lost:");
  for (const p of vs1.productions)
    console.log(" -", p.title);

  /* ===================== EXCEPTIONS ===================== */
  console.log("\n--- EXCEPTIONS (CONTROLADAS) ---");

  try {
    vs1.removeActor(keanu);
  } catch (e) {
    console.log("Excepción correcta al eliminar actor inexistente");
  }

  try {
    vs1.addUser(u1);
  } catch (e) {
    console.log("Excepción correcta por usuario duplicado");
  }

  try {
    vs1.assignCategory("NoCategory", matrix);
  } catch (e) {
    console.log("Excepción correcta por categoría inválida");
  }

  try {
    new Production("Nope", new Date());
  } catch (e) {
    console.log("Excepción correcta: Production es abstracta");
  }

  console.log("\n========== FIN TEST ==========");
}

/* EJECUCIÓN */
testVideoSystem();
