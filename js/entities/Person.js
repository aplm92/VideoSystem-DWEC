"use strict";

export class Person {
  #name; #lastname1; #lastname2; #born; #picture;

  constructor(name, lastname1, born, lastname2 = "", picture = "") {
    if (!name || !lastname1 || !(born instanceof Date))
      throw new Error("Invalid Person data");

    this.#name = name;
    this.#lastname1 = lastname1;
    this.#lastname2 = lastname2;
    this.#born = born;
    this.#picture = picture;
  }

  get name() { return this.#name; }
  get lastname1() { return this.#lastname1; }
  get lastname2() { return this.#lastname2; }
  get born() { return this.#born; }

  toString() {
    return `${this.#name} ${this.#lastname1}`;
  }
}
