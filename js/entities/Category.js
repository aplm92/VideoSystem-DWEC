"use strict";

export class Category {
  #name;
  #description;

  constructor(name, description = "") {
    if (!name || typeof name !== "string")
      throw new Error("Invalid category name");

    this.#name = name;
    this.#description = description;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    if (!value) throw new Error("Invalid category name");
    this.#name = value;
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
