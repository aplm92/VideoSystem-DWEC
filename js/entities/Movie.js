"use strict";

import { Production } from "./Production.js";

export class Movie extends Production {
  constructor(title, publication, resource = null) {
    super(title, publication);
    this.resource = resource;
    this.locations = [];
  }
}
