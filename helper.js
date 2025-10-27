// helper.js
export const state = {
  balance: {
    total: 0,
    currentamount: 0,
    newValue: 0,
    income: 0,
    expense: 0,
  },
  currentCurrency: "USD", // 🟢 Track current currency globally
};
// console.log(state.currentCurrency);

// 🔹 curnncy API
const currencySelect = document.getElementById("Currencyselect");
const monthlyIncome = document.querySelector(".Monthly-income");
const totalBalance = document.querySelector(".total-balane");
const expenceValue = document.querySelector(".expence-value");
// console.log(chartAmount.textContent);

// 🔹 Keep track of the current currency (start with USD)
let currentCurrency = "USD";

// 🔹 Universal currency converter (works for most currencies)
async function convertCurrency(from, to, amount) {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await res.json();

    if (!data.rates || !data.rates[to]) {
      throw new Error(`Currency "${to}" not available.`);
    }

    return (amount * data.rates[to]).toFixed(2);
  } catch (err) {
    console.error("Conversion failed:", err.message);
    return null;
  }
}

// 🔹 Currency change logic
if (currencySelect) {
  currencySelect.addEventListener("change", async function () {
    let targetCurrency = "";
    // export targetCurrency
    // Match dropdown value with real currency code
    if (currencySelect.value === "option-style-USD") targetCurrency = "USD";
    else if (currencySelect.value === "option-style-Pound")
      targetCurrency = "GBP";
    else if (currencySelect.value === "option-style-Rial")
      targetCurrency = "PKR";
    else return;
    const chartAmount = document.querySelectorAll(".chart-amount");
    console.log(targetCurrency);

    // Skip if same currency selected again
    if (targetCurrency === currentCurrency) return;

    // Convert all displayed values from current → target currency
    const elements = [
      monthlyIncome,
      totalBalance,
      expenceValue,
      ...chartAmount,
    ];

    for (const el of elements) {
      if (!el) continue;
      const value = parseValue(el.textContent);
      if (!value) continue;

      const converted = await convertCurrency(
        currentCurrency,
        targetCurrency,
        value
      );
      if (converted) {
        el.textContent = formatCurrency(converted, targetCurrency);
      }
    }

    // 🔹 Update current currency tracker
    currentCurrency = targetCurrency;
    state.currentCurrency = targetCurrency;

    // console.log(`✅ Currency switched: ${currentCurrency}`);
  });
}

// 🔹 Format currency

export function formatCurrency(value, code) {
  return `${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${code}`;
}
// 🔹 Update balance

export function parseValue(text) {
  return Number(text.replace(/[^\d.-]/g, "")) || 0;
}
export function updateBalance(element, amount, operation = "add") {
  const curVal = parseValue(element.textContent);
  const newVal =
    operation === "add" ? curVal + amount : Math.max(curVal - amount, 0);

  element.textContent = formatCurrency(newVal, state.currentCurrency);
  state.balance.total = newVal;
}
