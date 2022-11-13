class DataBaseError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'dataBaseError'; // (2)
  }
}
module.exports = DataBaseError;
