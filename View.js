export const modalInnerHtml = function (curtype) {
  // Normalize curtype to lowercase for consistent matching
  const type = curtype?.toLowerCase();
  let title;
  if (type === "income") title = "Add Income";
  else if (type === "expense") title = "Add Expense";
  else if (type === "transfer") title = "Transfer";
  else title = "Reset";

  const placeholders = {
    income: "e.g. Salary, Freelance",
    expense: "e.g. Rent, Grocery",
    transfer: "e.g. Transfer to Bank",
  };
  const placeholder = placeholders[type] ?? "e.g. Details";

  return `
    <div class="modal-overlay hidden" id="${type}Modal">
      <div class="modal">
        <button class="modal-close" aria-label="Close">&times;</button>
        <div class="modal-header">
          <div class="icon"><i data-feather="plus-circle"></i></div>
          <span class="modal-title">${title}</span>
        </div>
        <form class="modal-form">
          <div>
            <label for="source">Source</label>
            <input
              type="text"
              id="source"
              name="source"
              placeholder="${placeholder}"
            />
          </div>
    <p style="color:#ef4444;" class="insight-desc">
    Please enter the amount in the currency you have selected.
    </p>
          <div>
            <label for="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-add">Add</button>
            <button
              type="button"
              class="btn btn-cancel"
              style="background: var(--dark-600); color: var(--gray-100)"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
};

export const generateMarkuptrance = function (curtype, source, inputAmount) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;

  // ✅ Added time formatting (new functionality)
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <div class="transaction">
    <div class="flex-align-center">
      <div style="width: 20%" class="icon-box">
         <img src="img/icon-${curtype}.svg" alt="" /> 
      </div>
      <div class="transaction-info">
        <h3>${source}</h3>
        <div width: 114%; class="meta">
          <span width: 100%; >
            <i data-feather="credit-card" class="icon-xsmall"></i> Bank Account
          </span>
          <span width: 100%;>
            <i data-feather="calendar" class="icon-xsmall"></i> ${formattedDate}, ${formattedTime}
          </span>
        </div>
      </div>
    </div>
    <p class="amount ${curtype === "income" ? "positive" : "negative"}">
      $${inputAmount}
    </p>
  </div>`;
};
export const getresetmarkup = function () {
  return `<div
  style="display: flex; align-items: center; justify-content: center;"
  class="modal-overlay hidden"
  id="addIncomeModal"
>
  <div class="modal">
    <div style="display: flex; align-items: center;
      justify-content: space-between;" class="Warning-para">
      <p class="insight-desc">Are you sure to reset</p>
        <input  placeholder="Amount" style="border:none; border-radius: 12px; padding: 6px 2px;" class="reset-value" type="number" />
    </div>
    <button
      style="
        border-radius: 12px;
        background-color: #f87171;
        padding: 2px 6px;
        border: 2px solid #f87171;
        color: #065f46;
        font-weight: 500;
      "
      class="btn btn-add reset"
    >
      Reset
    </button>
  </div>
</div>`;
};
