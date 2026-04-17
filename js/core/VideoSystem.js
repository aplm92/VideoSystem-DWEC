"use strict";

import { Category } from "../entities/Category.js";
import { User } from "../entities/User.js";
import { Person } from "../entities/Person.js";
import { Production } from "../entities/Production.js";
import { VideoSystemException } from "../exceptions/VideoSystemException.js";

let instance = null;

/**
 * VideoSystem
 * ------------
 * Singleton que gestiona el estado del sistema de streaming.
 * Centraliza el acceso a todas las entidades del sistema.
 * Implementa el patrón Flyweight para evitar duplicados lógicos.
 */
export class VideoSystem {

  #name;

  // Almacenamiento principal
  #users = [];
  #productions = [];
  #categories = [];
  #actors = [];
  #directors = [];

  // Relaciones (Flyweight)
  #categoryProductions = new Map();
  #directorProductions = new Map();
  #actorProductions = new Map(); // actor → [{ production, role }]

  constructor(name = "VideoSystem") {
    if (instance) return instance;
    if (!name) throw VideoSystemException.INVALID_VALUE;
    this.#name = name;
    instance = this;
  }

  /* ===================== SINGLETON ===================== */

  static getInstance(name) {
    if (!instance) instance = new VideoSystem(name);
    return instance;
  }

  /* ===================== GETTERS ===================== */

  get name() { return this.#name; }
  set name(value) {
    if (!value) throw VideoSystemException.INVALID_VALUE;
    this.#name = value;
  }

  get users() { return this.#users.values(); }
  get productions() { return this.#productions.values(); }
  get categories() { return this.#categories.values(); }
  get actors() { return this.#actors.values(); }
  get directors() { return this.#directors.values(); }

  /* ===================== FLYWEIGHT GETTERS ===================== */

  createCategory(name, description = "") {
    let category = this.#categories.find(c => c.name === name);
    if (!category) {
      category = new Category(name, description);
      this.addCategory(category);
    }
    return category;
  }

  createProduction(title) {
    return this.#productions.find(p => p.title === title) ?? null;
  }

  createPerson(name, lastname1) {
    return (
      this.#actors.find(p => p.name === name && p.lastname1 === lastname1) ??
      this.#directors.find(p => p.name === name && p.lastname1 === lastname1) ??
      null
    );
  }

  /* ===================== USERS ===================== */

  addUser(...users) {
    for (const user of users) {
      if (!(user instanceof User)) throw VideoSystemException.INVALID_VALUE;

      if (this.#users.some(u => u.username === user.username))
        throw VideoSystemException.ALREADY_EXISTS;

      if (this.#users.some(u => u.email === user.email))
        throw VideoSystemException.ALREADY_EXISTS;

      this.#users.push(user);
    }
    return this.#users.length;
  }

  removeUser(user) {
    const index = this.#users.findIndex(u => u.username === user.username);
    if (index === -1) throw VideoSystemException.NOT_FOUND;
    this.#users.splice(index, 1);
    return this.#users.length;
  }

  /* ===================== CATEGORIES ===================== */

  addCategory(...categories) {
    for (const category of categories) {
      if (!(category instanceof Category))
        throw VideoSystemException.INVALID_VALUE;

      if (this.#categories.some(c => c.name === category.name))
        throw VideoSystemException.ALREADY_EXISTS;

      this.#categories.push(category);
      this.#categoryProductions.set(category, []);
    }
    return this.#categories.length;
  }

  removeCategory(category) {
    const index = this.#categories.findIndex(c => c.name === category.name);
    if (index === -1) throw VideoSystemException.NOT_FOUND;

    this.#categoryProductions.delete(this.#categories[index]);
    this.#categories.splice(index, 1);

    return this.#categories.length;
  }

  /* ===================== PRODUCTIONS ===================== */

  addProduction(...productions) {
    for (const prod of productions) {
      if (!(prod instanceof Production))
        throw VideoSystemException.INVALID_VALUE;

      if (this.#productions.some(p => p.title === prod.title))
        throw VideoSystemException.ALREADY_EXISTS;

      this.#productions.push(prod);
    }
    return this.#productions.length;
  }

  /**
   * Elimina una producción del sistema y todas sus relaciones.
   * (Requisito UT06)
   */
  removeProduction(production) {
    if (!(production instanceof Production))
      throw VideoSystemException.INVALID_VALUE;

    const index = this.#productions.findIndex(p => p.title === production.title);
    if (index === -1)
      throw VideoSystemException.NOT_FOUND;

    // 1. Eliminar de categorías
    for (const [cat, list] of this.#categoryProductions.entries()) {
      const i = list.findIndex(p => p.title === production.title);
      if (i !== -1) list.splice(i, 1);
    }

    // 2. Eliminar de actores
    for (const [actor, roles] of this.#actorProductions.entries()) {
      const i = roles.findIndex(r => r.production.title === production.title);
      if (i !== -1) roles.splice(i, 1);
    }

    // 3. Eliminar de directores
    for (const [director, list] of this.#directorProductions.entries()) {
      const i = list.findIndex(p => p.title === production.title);
      if (i !== -1) list.splice(i, 1);
    }

    // 4. Eliminar de la lista principal
    this.#productions.splice(index, 1);

    return this.#productions.length;
  }

  /* ===================== ACTORS ===================== */

  addActor(...actors) {
    for (const actor of actors) {
      if (!(actor instanceof Person))
        throw VideoSystemException.INVALID_VALUE;

      if (this.#actors.some(a => a.name === actor.name && a.lastname1 === actor.lastname1))
        throw VideoSystemException.ALREADY_EXISTS;

      this.#actors.push(actor);
      this.#actorProductions.set(actor, []);
    }
    return this.#actors.length;
  }

  removeActor(actor) {
    if (!(actor instanceof Person))
      throw VideoSystemException.INVALID_VALUE;

    const index = this.#actors.findIndex(
      a => a.name === actor.name && a.lastname1 === actor.lastname1
    );

    if (index === -1)
      throw VideoSystemException.NOT_FOUND;

    this.#actorProductions.delete(this.#actors[index]);
    this.#actors.splice(index, 1);

    return this.#actors.length;
  }

  /* ===================== DIRECTORS ===================== */

  addDirector(...directors) {
    for (const director of directors) {
      if (!(director instanceof Person))
        throw VideoSystemException.INVALID_VALUE;

      if (this.#directors.some(d => d.name === director.name && d.lastname1 === director.lastname1))
        throw VideoSystemException.ALREADY_EXISTS;

      this.#directors.push(director);
      this.#directorProductions.set(director, []);
    }
    return this.#directors.length;
  }

  removeDirector(director) {
    if (!(director instanceof Person))
      throw VideoSystemException.INVALID_VALUE;

    const index = this.#directors.findIndex(
      d => d.name === director.name && d.lastname1 === director.lastname1
    );

    if (index === -1)
      throw VideoSystemException.NOT_FOUND;

    this.#directorProductions.delete(this.#directors[index]);
    this.#directors.splice(index, 1);

    return this.#directors.length;
  }

  /* ===================== ASSIGN / DEASSIGN ===================== */

  assignCategory(category, ...productions) {
    if (!(category instanceof Category))
      throw VideoSystemException.INVALID_VALUE;

    if (!this.#categoryProductions.has(category))
      this.addCategory(category);

    const list = this.#categoryProductions.get(category);

    for (const prod of productions) {
      if (!this.#productions.includes(prod))
        this.addProduction(prod);

      if (!list.some(p => p.title === prod.title))
        list.push(prod);
    }
    return list.length;
  }

  assignActor(actor, production, role = "") {
    if (!(actor instanceof Person) || !(production instanceof Production))
      throw VideoSystemException.INVALID_VALUE;

    if (!this.#actorProductions.has(actor))
      this.addActor(actor);

    if (!this.#productions.some(p => p.title === production.title))
      this.addProduction(production);

    const list = this.#actorProductions.get(actor);

    if (!list.some(obj => obj.production.title === production.title))
      list.push({ production, role });

    return list.length;
  }

  deassignActor(actor, production) {
    if (!(actor instanceof Person) || !(production instanceof Production))
      throw VideoSystemException.INVALID_VALUE;

    const list = this.#actorProductions.get(actor);
    if (!list) throw VideoSystemException.NOT_FOUND;

    const index = list.findIndex(obj => obj.production.title === production.title);
    if (index !== -1) list.splice(index, 1);

    return list.length;
  }

  assignDirector(director, ...productions) {
    if (!(director instanceof Person))
      throw VideoSystemException.INVALID_VALUE;

    if (!this.#directorProductions.has(director))
      this.addDirector(director);

    const list = this.#directorProductions.get(director);

    for (const prod of productions) {
      if (!(prod instanceof Production))
        throw VideoSystemException.INVALID_VALUE;

      if (!this.#productions.includes(prod))
        this.addProduction(prod);

      if (!list.some(p => p.title === prod.title))
        list.push(prod);
    }

    return list.length;
  }

  deassignDirector(director, ...productions) {
    if (!(director instanceof Person))
      throw VideoSystemException.INVALID_VALUE;

    const list = this.#directorProductions.get(director);
    if (!list) throw VideoSystemException.NOT_FOUND;

    for (const prod of productions) {
      const index = list.findIndex(p => p.title === prod.title);
      if (index !== -1) list.splice(index, 1);
    }

    return list.length;
  }

  /* ===================== CONSULTAS ===================== */

  *getProductionsActor(actor) {
    if (!this.#actorProductions.has(actor))
      throw VideoSystemException.NOT_FOUND;

    for (const obj of this.#actorProductions.get(actor)) {
      yield obj;
    }
  }

  *getProductionsCategory(category) {
    if (!this.#categoryProductions.has(category))
      throw VideoSystemException.NOT_FOUND;

    for (const prod of this.#categoryProductions.get(category)) {
      yield prod;
    }
  }

  *getProductionsDirector(director) {
    if (!this.#directorProductions.has(director))
      throw VideoSystemException.NOT_FOUND;

    for (const prod of this.#directorProductions.get(director)) {
      yield prod;
    }
  }

  *getCast(production) {
    for (const [actor, roles] of this.#actorProductions.entries()) {
      for (const r of roles) {
        if (r.production.title === production.title)
          yield { actor, role: r.role };
      }
    }
  }

  /* ===================== FILTROS ===================== */

  *findProductions(filterFn) {
    for (const prod of this.#productions) {
      if (filterFn(prod)) yield prod;
    }
  }

  *filterProductionsInCategory(category, filterFn) {
    if (!this.#categoryProductions.has(category))
      throw VideoSystemException.NOT_FOUND;

    for (const prod of this.#categoryProductions.get(category)) {
      if (filterFn(prod)) yield prod;
    }
  }
}
