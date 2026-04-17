"use strict";

export class Coordinate {
  #latitude;
  #longitude;

  constructor(latitude, longitude) {
    if (typeof latitude !== "number" || latitude < -90 || latitude > 90)
      throw new Error("Invalid latitude");

    if (typeof longitude !== "number" || longitude < -180 || longitude > 180)
      throw new Error("Invalid longitude");

    this.#latitude = latitude;
    this.#longitude = longitude;
  }

  get latitude() {
    return this.#latitude;
  }

  set latitude(value) {
    if (typeof value !== "number" || value < -90 || value > 90)
      throw new Error("Invalid latitude");
    this.#latitude = value;
  }

  get longitude() {
    return this.#longitude;
  }

  set longitude(value) {
    if (typeof value !== "number" || value < -180 || value > 180)
      throw new Error("Invalid longitude");
    this.#longitude = value;
  }

  toString() {
    return `(${this.#latitude}, ${this.#longitude})`;
  }
}
