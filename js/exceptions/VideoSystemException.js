"use strict";

/**
 * Excepción base del sistema.
 * Permite crear errores con nombre y mensaje personalizados.
 */
class VideoSystemBaseException extends Error {
  constructor(message = "VideoSystem error") {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Conjunto de excepciones específicas del sistema.
 * Se usan en todas las entidades y en VideoSystem.js.
 */
export const VideoSystemException = {

  INVALID_VALUE: new VideoSystemBaseException("Invalid value"),
  NULL_VALUE: new VideoSystemBaseException("Null value not allowed"),
  ALREADY_EXISTS: new VideoSystemBaseException("Element already exists"),
  NOT_FOUND: new VideoSystemBaseException("Element not found"),

  // Excepciones adicionales útiles
  INVALID_TYPE: new VideoSystemBaseException("Invalid type"),
  ABSTRACT_CLASS: new VideoSystemBaseException("Cannot instantiate abstract class"),
  ALREADY_ASSIGNED: new VideoSystemBaseException("Element already assigned"),
  EMPTY_COLLECTION: new VideoSystemBaseException("Collection is empty"),
  UNIMPLEMENTED_METHOD: new VideoSystemBaseException("Method not implemented")
};

export { VideoSystemBaseException };
