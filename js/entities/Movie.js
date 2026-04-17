"use strict";

import { Production } from "./Production.js";
import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class Movie extends Production {

  constructor(title, publication, resource = null) {
    super(title, publication);

    // Validación del recurso
    if (resource !== null && typeof resource !== "string") {
      throw VideoSystemException.INVALID_VALUE;
    }

    this.resource = resource?.trim() ?? null;

    // Lista de localizaciones (opcional)
    this.locations = [];
  }

  /**
   * Añade una localización de rodaje.
   */
  addLocation(location) {
    if (!location || typeof location !== "string") {
      throw VideoSystemException.INVALID_VALUE;
    }
    this.locations.push(location.trim());
  }

  /**
   * Elimina una localización si existe.
   */
  removeLocation(location) {
    const index = this.locations.indexOf(location);
    if (index !== -1) {
      this.locations.splice(index, 1);
    }
  }
}
