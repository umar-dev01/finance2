import * as helper from "./helper.js";

export class transaction {
  constructor(type, amount, note, date = new Date().toISOString()) {
    this.id = Date.now().toString(); // unique id for delete
    this.type = type;
    this.amount = amount;
    this.note = note;
    this.date = date;
    this.time = new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formateAmount() {
    return `${this.type === "income" ? "+" : "-"}$${this.amount.toFixed(2)}`;
  }

  toHTML() {
    return `
      <div class="transaction" data-id="${this.id}" style="position: relative;">
        <button class="delete-transaction-btn hidden-btn">&times;</button>
        <div class="flex-align-center">
          <div style="width: 20%" class="icon-box">
            <img src="img/icon-${this.type}.svg" alt="" /> 
          </div>
          <div class="transaction-info">
            <h3>${this.note}</h3>
            <div class="meta">
              <span><i data-feather="calendar" class="icon-xsmall"></i> ${new Date(
                this.date
              ).toLocaleDateString()}, ${this.time}</span>
            </div>
          </div>
        </div>
        <p class="amount chart-amount ${
          this.type === "income" ? "positive" : "negative"
        }">
          ${this.formateAmount()}
        </p>
      </div>`;
  }
}
