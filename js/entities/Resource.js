"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Resource {

  #duration;
  #link;

  constructor(duration, link) {

    if (!Resource.#isValidDuration(duration))
      throw VideoSystemException.INVALID_VALUE;

    if (!Resource.#isValidLink(link))
      throw VideoSystemException.INVALID_VALUE;

    this.#duration = Number(duration);
    this.#link = link.trim();
  }

  /* ============================
     GETTERS
  ============================ */

  get duration() { return this.#duration; }
  get link() { return this.#link; }

  /* ============================
     SETTERS
  ============================ */

  set duration(value) {
    if (!Resource.#isValidDuration(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#duration = Number(value);
  }

  set link(value) {
    if (!Resource.#isValidLink(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#link = value.trim();
  }

  /* ============================
     VALIDACIONES PRIVADAS
  ============================ */

  static #isValidDuration(value) {
    return (
      typeof value === "number" &&
      !isNaN(value) &&
      value > 0
    );
  }

  static #isValidLink(value) {
    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  }

  /* ============================
     MÉTODOS
  ============================ */

  toString() {
    return `${this.#duration} min`;
  }
}
