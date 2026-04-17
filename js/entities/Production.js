"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Production {

  #title;
  #publication;
  #nationality;
  #synopsis;
  #image;

  constructor(title, publication) {

    // Evitar instanciación directa (clase abstracta)
    if (new.target === Production)
      throw VideoSystemException.ABSTRACT_CLASS;

    // Validaciones
    if (!title || typeof title !== "string")
      throw VideoSystemException.INVALID_VALUE;

    if (!(publication instanceof Date) || isNaN(publication.getTime()))
      throw VideoSystemException.INVALID_VALUE;

    // Normalización
    this.#title = title.trim();
    this.#publication = publication;

    // Valores opcionales
    this.#nationality = "";
    this.#synopsis = "";
    this.#image = "";
  }

  /* ============================
     GETTERS
  ============================ */

  get title() { return this.#title; }
  get publication() { return this.#publication; }
  get nationality() { return this.#nationality; }
  get synopsis() { return this.#synopsis; }
  get image() { return this.#image; }

  /* ============================
     SETTERS
  ============================ */

  set nationality(value) {
    this.#nationality = value?.trim() ?? "";
  }

  set synopsis(value) {
    this.#synopsis = value?.trim() ?? "";
  }

  set image(value) {
    if (value !== "" && typeof value !== "string")
      throw VideoSystemException.INVALID_VALUE;

    this.#image = value?.trim() ?? "";
  }

  /* ============================
     MÉTODOS
  ============================ */

  toString() {
    return this.#title;
  }
}
