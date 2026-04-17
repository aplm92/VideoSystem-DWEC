"use strict";

import { VideoSystemException } from "../exceptions/VideoSystemException.js";

export class User {

  #username;
  #email;
  #password;

  constructor(username, email, password) {

    // Validación de username
    if (!username || typeof username !== "string")
      throw VideoSystemException.INVALID_VALUE;

    // Validación de email
    if (!User.#isValidEmail(email))
      throw VideoSystemException.INVALID_VALUE;

    // Validación de contraseña
    if (!password || typeof password !== "string" || password.length < 6)
      throw VideoSystemException.INVALID_VALUE;

    // Normalización
    this.#username = username.trim();
    this.#email = email.trim().toLowerCase();
    this.#password = password.trim();
  }

  /* ============================
     GETTERS
  ============================ */

  get username() { return this.#username; }
  get email() { return this.#email; }
  get password() { return this.#password; }

  /* ============================
     SETTERS
  ============================ */

  set email(value) {
    if (!User.#isValidEmail(value))
      throw VideoSystemException.INVALID_VALUE;

    this.#email = value.trim().toLowerCase();
  }

  set password(value) {
    if (!value || typeof value !== "string" || value.length < 6)
      throw VideoSystemException.INVALID_VALUE;

    this.#password = value.trim();
  }

  /* ============================
     MÉTODOS
  ============================ */

  toString() {
    return this.#username;
  }

  static #isValidEmail(email) {
    if (!email || typeof email !== "string") return false;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email.trim().toLowerCase());
  }
}
