"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Person {
  #name;
  #lastname1;
  #lastname2;
  #born;
  #picture;

  constructor(name, lastname1, born, lastname2 = "", picture = "") {

    // Validaciones
    if (!name || typeof name !== "string")
      throw VideoSystemException.INVALID_VALUE;

    if (!lastname1 || typeof lastname1 !== "string")
      throw VideoSystemException.INVALID_VALUE;

    if (!(born instanceof Date) || isNaN(born.getTime()))
      throw VideoSystemException.INVALID_VALUE;

    if (lastname2 !== "" && typeof lastname2 !== "string")
      throw VideoSystemException.INVALID_VALUE;

    if (picture !== "" && typeof picture !== "string")
      throw VideoSystemException.INVALID_VALUE;

    // Normalización
    this.#name = name.trim();
    this.#lastname1 = lastname1.trim();
    this.#lastname2 = lastname2?.trim() ?? "";
    this.#born = born;
    this.#picture = picture?.trim() ?? "";
  }

  /* ============================
     GETTERS
  ============================ */

  get name() { return this.#name; }
  get lastname1() { return this.#lastname1; }
  get lastname2() { return this.#lastname2; }
  get born() { return this.#born; }
  get picture() { return this.#picture; }

  /* ============================
     SETTERS (opcionales)
  ============================ */

  set picture(value) {
    if (value !== "" && typeof value !== "string")
      throw VideoSystemException.INVALID_VALUE;

    this.#picture = value?.trim() ?? "";
  }

  toString() {
    return `${this.#name} ${this.#lastname1}`;
  }
}
