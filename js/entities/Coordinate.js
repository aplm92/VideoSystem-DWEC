"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Coordinate {

  #latitude;
  #longitude;

  constructor(latitude, longitude) {

    if (!Coordinate.#isValidLatitude(latitude))
      throw VideoSystemException.INVALID_VALUE;

    if (!Coordinate.#isValidLongitude(longitude))
      throw VideoSystemException.INVALID_VALUE;

    this.#latitude = Number(latitude);
    this.#longitude = Number(longitude);
  }

  /* ============================
     GETTERS
  ============================ */

  get latitude() { return this.#latitude; }
  get longitude() { return this.#longitude; }

  /* ============================
     SETTERS
  ============================ */

  set latitude(value) {
    if (!Coordinate.#isValidLatitude(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#latitude = Number(value);
  }

  set longitude(value) {
    if (!Coordinate.#isValidLongitude(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#longitude = Number(value);
  }

  /* ============================
     VALIDACIONES PRIVADAS
  ============================ */

  static #isValidLatitude(value) {
    return (
      typeof value === "number" &&
      !isNaN(value) &&
      value >= -90 &&
      value <= 90
    );
  }

  static #isValidLongitude(value) {
    return (
      typeof value === "number" &&
      !isNaN(value) &&
      value >= -180 &&
      value <= 180
    );
  }

  /* ============================
     MÉTODOS
  ============================ */

  toString() {
    return `(${this.#latitude}, ${this.#longitude})`;
  }
}
