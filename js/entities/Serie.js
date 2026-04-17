"use strict";

import { Production } from "./Production.js";
import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Serie extends Production {

  #seasons;
  #resources;
  #locations;

  constructor(title, publication, seasons = 1) {
    super(title, publication);

    if (!Serie.#isValidSeason(seasons))
      throw VideoSystemException.INVALID_VALUE;

    this.#seasons = Number(seasons);
    this.#resources = [];
    this.#locations = [];
  }

  /* ============================
     GETTERS
  ============================ */

  get seasons() { return this.#seasons; }
  get resources() { return [...this.#resources]; }
  get locations() { return [...this.#locations]; }

  /* ============================
     SETTERS
  ============================ */

  set seasons(value) {
    if (!Serie.#isValidSeason(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#seasons = Number(value);
  }

  /* ============================
     MÉTODOS: RESOURCES
  ============================ */

  addResource(resource) {
    if (!resource)
      throw VideoSystemException.INVALID_VALUE;

    this.#resources.push(resource);
  }

  removeResource(resource) {
    const index = this.#resources.indexOf(resource);
    if (index !== -1) this.#resources.splice(index, 1);
  }

  /* ============================
     MÉTODOS: LOCATIONS
  ============================ */

  addLocation(location) {
    if (!location || typeof location !== "string")
      throw VideoSystemException.INVALID_VALUE;

    this.#locations.push(location.trim());
  }

  removeLocation(location) {
    const index = this.#locations.indexOf(location);
    if (index !== -1) this.#locations.splice(index, 1);
  }

  /* ============================
     VALIDACIONES PRIVADAS
  ============================ */

  static #isValidSeason(value) {
    return (
      typeof value === "number" &&
      !isNaN(value) &&
      value >= 1
    );
  }
}
