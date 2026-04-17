"use strict";

export class User {
  #username;
  #email;
  #password;

  constructor(username, email, password) {
    if (!username || typeof username !== "string")
      throw new Error("Invalid username");

    if (!User.#isValidEmail(email))
      throw new Error("Invalid email");

    if (!password || password.length < 6)
      throw new Error("Invalid password");

    this.#username = username;
    this.#email = email;
    this.#password = password;
  }

  get username() {
    return this.#username;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  set email(value) {
    if (!User.#isValidEmail(value))
      throw new Error("Invalid email");
    this.#email = value;
  }

  set password(value) {
    if (!value || value.length < 6)
      throw new Error("Invalid password");
    this.#password = value;
  }

  toString() {
    return this.#username;
  }

  static #isValidEmail(email) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email);
  }
}
