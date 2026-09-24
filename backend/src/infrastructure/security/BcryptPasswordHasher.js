const bcrypt = require("bcryptjs");
const PasswordHasher = require("../../application/ports/PasswordHasher");

class BcryptPasswordHasher extends PasswordHasher {
  constructor(rounds = 10) {
    super();
    this.rounds = rounds;
  }

  async hash(password) {
    return bcrypt.hash(password, this.rounds);
  }

  async comparar(password, hash) {
    return bcrypt.compare(String(password ?? ""), hash);
  }
}

module.exports = BcryptPasswordHasher;
