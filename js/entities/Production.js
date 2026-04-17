"use strict";

export class Production {
  constructor(title, publication) {
    if (new.target === Production)
      throw new Error("Production is abstract");

    if (!title || !(publication instanceof Date))
      throw new Error("Invalid Production data");

    this.title = title;
    this.publication = publication;
    this.nationality = "";
    this.synopsis = "";
    this.image = "";
  }

  toString() {
    return this.title;
  }
}
