"use strict";

import { Production } from "./Production.js";

export class Serie extends Production {
  constructor(title, publication, seasons = 1) {
    super(title, publication);
    this.seasons = seasons;
    this.resources = [];
    this.locations = [];
  }
}
