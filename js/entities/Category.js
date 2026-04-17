"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Category {
  #name;
  #description;

  constructor(name, description = "") {
    if (!name || typeof name !== "string")
      throw VideoSystemException.INVALID_VALUE;

    this.#name = name.trim();
    this.#description = description ?? "";
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (!value || typeof value !== "string")
      throw VideoSystemException.INVALID_VALUE;

    this.#name = value.trim();
  }

  get description() {
    return this.#description;
  }

  set description(value) {
    this.#description = value ?? "";
  }

  toString() {
    return this.#name;
  }
}
