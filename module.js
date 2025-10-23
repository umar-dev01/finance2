"use strict";
// import { modalInnerHtml } from "./View.js";
import * as View from "./View.js";
// import { updateBalance } from "./helper.js";
import * as helper from "./helper.js";

const quickBtn = document.querySelectorAll(".quick-btn");
export const monthlyIncome = document.querySelector(".Monthly-income");
export const totalBalane = document.querySelector(".total-balane");
const expenceValue = document.querySelector(".expence-value");
const transactionContiner = document.querySelector(".transactions");
const resetBtn = document.querySelector(".reset-btn");

export const quickClickOpenMod = function () {
  quickBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const curtype = btn.dataset.type;

      document.body.insertAdjacentHTML(
        "beforeend",
        View.modalInnerHtml(curtype)
      );
      feather.replace();

      const modalOverlays = document.querySelectorAll(".modal-overlay"); ///
      const currentModal = modalOverlays[modalOverlays.length - 1];
      const modalClose = currentModal.querySelector(".modal-close");
      const btnCancel = currentModal.querySelector(".btn-cancel");
      const addQuickBtn = currentModal.querySelector(".btn-add");
      const amount = currentModal.querySelector("#amount");
      const source = currentModal.querySelector("#source");
      const modalResetCancel = document.querySelector(".modal-reset-cancel");

      currentModal.classList.remove("hidden");

      const closeModal = () => currentModal.remove();
      modalClose.addEventListener("click", closeModal);
      btnCancel.addEventListener("click", closeModal);
      currentModal.addEventListener("click", (e) => {
        if (e.target === currentModal) closeModal();
      });

      addQuickBtn.addEventListener("click", () => {
        const inputAmount = Number(amount.value);
        const inputSource = source.value;
        if (!inputAmount) return;
        if (!inputSource) {
          alert("Please enter a source name.");
          return;
        }

        // If user enters a numeric string like "123" or "4567"
        if (!isNaN(inputSource)) {
          alert("Source name cannot be a number.");
          return;
        }
        // 🟢 Add Income
        if (curtype === "income") {
          helper.updateBalance(monthlyIncome, inputAmount, "add");
          helper.updateBalance(totalBalane, inputAmount, "add");
        }

        // 🔴 Add Expense
        if (curtype === "Expense") {
          const current =
            Number(totalBalane.textContent.replace(/[^\d.-]/g, "")) || 0;

          if (inputAmount > current) {
            alert("Insufficient balance to add this expense.");
            return;
          }

          helper.updateBalance(expenceValue, inputAmount, "add"); // ✅ Add to total expenses
          helper.updateBalance(totalBalane, inputAmount, "subtract"); // ✅ Subtract from total
        }
        // console.log(curtype);
        const html = View.generateMarkuptrance(
          curtype,
          inputSource,
          inputAmount
        );
        transactionContiner.insertAdjacentHTML("beforeend", html);
        feather.replace();
        setTimeout(closeModal, 10);
      });
    });
  });
};
export const resetMothIncome = function () {
  resetBtn.addEventListener("click", () => {
    // Inject modal HTML into body
    document.body.insertAdjacentHTML("beforeend", View.getresetmarkup());

    // Select modal and elements
    const modalOverlay = document.querySelector(".modal-overlay");
    const modal = modalOverlay.querySelector(".modal");
    const resetAmount = modalOverlay.querySelector(".reset-value");
    const reset = modalOverlay.querySelector(".reset");
    const closeBtn = modalOverlay.querySelector(".close-reset-model");
    // Show modal
    modalOverlay.classList.remove("hidden");
    // ✅ Reset Button
    reset.addEventListener("click", () => {
      const inputAmount = Number(resetAmount.value);

      if (isNaN(inputAmount) || inputAmount < 0) {
        alert("Please enter a valid income amount.");
        return;
      }

      // Update income
      monthlyIncome.textContent = helper.formatCurrency(
        inputAmount,
        helper.state.currentCurrency
      );

      // Close modal
      closeModal();
    });

    // ✅ Cancel Button
    closeBtn.addEventListener("click", closeModal);

    // ✅ Click Outside to Close
    modalOverlay.addEventListener("click", (e) => {
      // if user clicks outside the .modal box
      if (!modal.contains(e.target)) {
        closeModal();
      }
    });

    // 🔹 Helper Function to Close and Clean Up Modal
    function closeModal() {
      modalOverlay.classList.add("hidden");
      setTimeout(() => modalOverlay.remove(), 200); // delay for smoothness
    }
  });
};

// helper.ex(expenceValue);
