"use strict";

export class Resource {
  #duration;
  #link;

  constructor(duration, link) {
    if (typeof duration !== "number" || duration <= 0)
      throw new Error("Invalid duration");

    if (!link || typeof link !== "string")
      throw new Error("Invalid resource link");

    this.#duration = duration;
    this.#link = link;
  }

  get duration() {
    return this.#duration;
  }

  set duration(value) {
    if (typeof value !== "number" || value <= 0)
      throw new Error("Invalid duration");
    this.#duration = value;
  }

  get link() {
    return this.#link;
  }

  set link(value) {
    if (!value) throw new Error("Invalid resource link");
    this.#link = value;
  }

  toString() {
    return `${this.#duration} min`;
  }
}
