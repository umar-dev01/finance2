"use strict";
import * as View from "./View.js";
import * as helper from "./helper.js";
import { transaction } from "./transaction.js";

// -------------------------------
// 🧠 APP STATE
// -------------------------------
export const state = {
  balance: 0,
  income: 0,
  expense: 0,
  transactions: [],
};

// -------------------------------
// 🔄 DOM ELEMENTS
// -------------------------------
const quickBtn = document.querySelectorAll(".quick-btn");
export let monthlyIncome = document.querySelector(".Monthly-income");
export const totalBalane = document.querySelector(".total-balane");
const expenceValue = document.querySelector(".expence-value");
const transactionContiner = document.querySelector(".transactions");
const resetBtn = document.querySelector(".reset-btn");

// -------------------------------
// 💾 LOCAL STORAGE HELPERS
// -------------------------------
function saveState() {
  localStorage.setItem("financeState", JSON.stringify(state));
}

function loadState() {
  const data = localStorage.getItem("financeState");
  if (!data) return;
  Object.assign(state, JSON.parse(data));
  renderUI();
}

// -------------------------------
// 🎨 RENDER FUNCTION
// -------------------------------
function renderUI() {
  // Update income/expense/balance values
  monthlyIncome.textContent = helper.formatCurrency(
    state.income,
    helper.state.currentCurrency
  );
  expenceValue.textContent = helper.formatCurrency(
    state.expense,
    helper.state.currentCurrency
  );
  totalBalane.textContent = helper.formatCurrency(
    state.balance,
    helper.state.currentCurrency
  );

  // Render all transactions
  transactionContiner.innerHTML = "";
  state.transactions.forEach((t) => {
    const newTrans = new transaction(
      t.type,
      t.amount,
      t.source || t.note,
      t.date
    );
    newTrans.id = t.id; // keep the same id
    transactionContiner.insertAdjacentHTML("beforeend", newTrans.toHTML());
  });

  feather.replace();

  // 🗑️ Add delete logic for each transaction
  const deleteBtns = document.querySelectorAll(".delete-transaction-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const transEl = e.target.closest(".transaction");
      const id = transEl.dataset.id;

      // Remove from state
      state.transactions = state.transactions.filter((t) => t.id !== id);

      // Recalculate totals
      recalculateTotals();

      // Save & re-render
      saveState();
      renderUI();
    });
  });
}

// -------------------------------
// 🔢 RECALCULATE TOTALS
// -------------------------------
function recalculateTotals() {
  let income = 0;
  let expense = 0;

  state.transactions.forEach((t) => {
    if (t.type === "income") income += Number(t.amount);
    else if (t.type.toLowerCase() === "expense") expense += Number(t.amount);
  });

  state.income = income;
  state.expense = expense;
  state.balance = income - expense;
}

// -------------------------------
// ⚡ QUICK BUTTON FUNCTIONALITY
// -------------------------------
export const quickClickOpenMod = function () {
  quickBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const curtype = btn.dataset.type;

      document.body.insertAdjacentHTML(
        "beforeend",
        View.modalInnerHtml(curtype)
      );
      feather.replace();

      const modalOverlays = document.querySelectorAll(".modal-overlay");
      const currentModal = modalOverlays[modalOverlays.length - 1];
      const modalClose = currentModal.querySelector(".modal-close");
      const btnCancel = currentModal.querySelector(".btn-cancel");
      const addQuickBtn = currentModal.querySelector(".btn-add");
      const amount = currentModal.querySelector("#amount");
      const source = currentModal.querySelector("#source");

      currentModal.classList.remove("hidden");

      const closeModal = () => currentModal.remove();
      modalClose.addEventListener("click", closeModal);
      btnCancel.addEventListener("click", closeModal);
      currentModal.addEventListener("click", (e) => {
        if (e.target === currentModal) closeModal();
      });

      addQuickBtn.addEventListener("click", () => {
        const inputAmount = Number(amount.value);
        const inputSource = source.value.trim();

        if (!inputAmount || !inputSource) {
          alert("Please enter both amount and source.");
          return;
        }
        if (!isNaN(inputSource)) {
          alert("Source name cannot be a number.");
          return;
        }

        // 🟢 Add Income
        if (curtype === "income") {
          state.income += inputAmount;
          state.balance += inputAmount;
        }

        // 🔴 Add Expense
        if (curtype === "Expense") {
          if (inputAmount > state.balance) {
            alert("Insufficient balance to add this expense.");
            return;
          }
          state.expense += inputAmount;
          state.balance -= inputAmount;
        }

        // ✅ Create new transaction with unique id
        const newTransaction = {
          id: Date.now().toString(),
          type: curtype,
          amount: inputAmount,
          source: inputSource,
          date: new Date().toISOString(),
        };
        state.transactions.push(newTransaction);

        // ✅ Save & render
        saveState();
        renderUI();

        setTimeout(closeModal, 10);
      });
    });
  });
};

// -------------------------------
// 🔄 RESET MONTHLY INCOME
// -------------------------------
export const resetMothIncome = function () {
  resetBtn.addEventListener("click", () => {
    document.body.insertAdjacentHTML("beforeend", View.getresetmarkup());
    const modalOverlay = document.querySelector(".modal-overlay");
    const modal = modalOverlay.querySelector(".modal");
    const resetAmount = modalOverlay.querySelector(".reset-value");
    const reset = modalOverlay.querySelector(".reset");
    const closeBtn = modalOverlay.querySelector(".close-reset-model");

    modalOverlay.classList.remove("hidden");

    reset.addEventListener("click", () => {
      const inputAmount = Number(resetAmount.value);

      if (isNaN(inputAmount) || inputAmount < 0) {
        alert("Please enter a valid income amount.");
        return;
      }

      // ✅ Update only Monthly Income (not balance or expense)
      state.income = inputAmount;
      recalculateTotals();

      // ✅ Save and render
      saveState();
      renderUI();

      closeModal();
    });

    closeBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (!modal.contains(e.target)) closeModal();
    });

    function closeModal() {
      modalOverlay.classList.add("hidden");
      setTimeout(() => modalOverlay.remove(), 200);
    }
  });
};

// -------------------------------
// 🚀 INIT APP
// -------------------------------
window.addEventListener("load", loadState);
