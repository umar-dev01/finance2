import { transaction } from "./transaction.js";

export class financeManager extends transaction {
  constructor() {
    this.balance = 0;
    this.expence = 0;
    this.income = 0;
    this.transaction = [];
  }
  addTransaction(transaction) {
    this.transactions.push(transaction); // store the new transaction
    this.calculateTotals(); // recalculate income/expense/balance
    this.saveToLocalStorage(); // persist changes
  }
  calculateTotals() {}
}
