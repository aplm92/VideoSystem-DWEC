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

  // Almacenamiento principal (estado del sistema)
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
  /* Permiten recuperar instancias únicas (clave para Interfaz Grafica) */

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
      if (!(user instanceof User))
        throw VideoSystemException.INVALID_VALUE;

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

  /* ===================== ACTORS / DIRECTORS ===================== */

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

  /**
 * Elimina un actor del sistema y todas sus relaciones
 * con las producciones en las que participa.
 */
removeActor(actor) {
  if (!(actor instanceof Person))
    throw VideoSystemException.INVALID_VALUE;

  const index = this.#actors.findIndex(
    a => a.name === actor.name && a.lastname1 === actor.lastname1
  );

  if (index === -1)
    throw VideoSystemException.NOT_FOUND;

  // Eliminamos relaciones actor-producción
  this.#actorProductions.delete(this.#actors[index]);

  // Eliminamos el actor del sistema
  this.#actors.splice(index, 1);

  return this.#actors.length;
}


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

  /**
 * Elimina un director del sistema y todas sus relaciones
 * con las producciones que dirige.
 */
removeDirector(director) {
  if (!(director instanceof Person))
    throw VideoSystemException.INVALID_VALUE;

  const index = this.#directors.findIndex(
    d => d.name === director.name && d.lastname1 === director.lastname1
  );

  if (index === -1)
    throw VideoSystemException.NOT_FOUND;

  // Eliminamos relaciones director-producción
  this.#directorProductions.delete(this.#directors[index]);

  // Eliminamos el director del sistema
  this.#directors.splice(index, 1);

  return this.#directors.length;
}


  /* ===================== ASSIGN / DEASSIGN ===================== */

  /**
   * Asigna una o más producciones a una categoría.
   * Si no existen en el sistema, se añaden.
   */
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

  /* ===================== ACTORS ===================== */
/**
 * Asigna un actor a una producción con un rol determinado.
 * Si el actor o la producción no existen, se añaden al sistema.
 */
assignActor(actor, production, role = "") {
  if (!(actor instanceof Person) || !(production instanceof Production))
    throw VideoSystemException.INVALID_VALUE;

  // Flyweight: asegurar actor
  if (!this.#actorProductions.has(actor)) {
    this.addActor(actor);
  }

  // Flyweight: asegurar producción
  if (!this.#productions.some(p => p.title === production.title)) {
    this.addProduction(production);
  }

  const list = this.#actorProductions.get(actor);

  // Evitar duplicados
  if (!list.some(obj => obj.production.title === production.title)) {
    list.push({ production, role });
  }

  return list.length;
}

/**
 * Elimina la relación entre un actor y una producción.
 */
deassignActor(actor, production) {
  if (!(actor instanceof Person) || !(production instanceof Production))
    throw VideoSystemException.INVALID_VALUE;

  const list = this.#actorProductions.get(actor);
  if (!list) throw VideoSystemException.NOT_FOUND;

  const index = list.findIndex(
    obj => obj.production.title === production.title
  );

  if (index !== -1) list.splice(index, 1);

  return list.length;
}


  /* ===================== DIRECTORS ===================== */
/*
 * Asigna una o más producciones a un director.
 * Si el director o la producción no existen, se añaden al sistema.
 */
assignDirector(director, ...productions) {
  if (!(director instanceof Person))
    throw VideoSystemException.INVALID_VALUE;

  // Flyweight: aseguramos existencia del director
  if (!this.#directorProductions.has(director)) {
    this.addDirector(director);
  }

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

/**
 * Desasigna una o más producciones de un director.
 */
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


  /* ===================== CONSULTAS (GENERADORES) ===================== */

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

  /* ===================== FILTROS (GENERADORES) ===================== */

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
