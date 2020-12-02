// query selecting needed item to update for live site
let incomeTransactionList = document.querySelector(".income__list");
incomeTransactionList.innerHTML = "";
let expenseTransactionList = document.querySelector(".expenses__list");
expenseTransactionList.innerHTML = "";
let submitButton = document.querySelector(".ion-ios-checkmark-outline");
let cancleButton = document.querySelectorAll(".ion-ios-close-outline");

let topCurrentDate = document.querySelector(".budget__title--month");
// Create month array to display months in word
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let newDate = new Date();
topCurrentDate.innerHTML = `${
  months[newDate.getMonth()]
} ${newDate.getUTCFullYear()}`;

let totalBudgetValue = document.querySelector(".budget__value");
totalBudgetValue.innerHTML = "$0.00";
let incomeTotalDisplay = document.querySelector(".budget__income--value");
incomeTotalDisplay.innerHTML = "$0.00";
let expenseTotalDisplay = document.querySelector(".budget__expenses--value");
expenseTotalDisplay.innerHTML = "$0.00";
let expensePercentageDisplay = document.querySelector(
  ".budget__expenses--percentage"
);
expensePercentageDisplay.innerHTML = "0%";

let inputDescription = document.querySelector(".add__description");
let inputValue = document.querySelector(".add__value");

class TransactionList {
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
  }

  addNewTransaction(description, amount) {
    if (amount > 0) {
      this.incomeList.push(new Transaction(description, amount, this.id++));
      this.render();
    } else if (amount < 0) {
      this.expenseList.push(new Transaction(description, amount, this.id++));
      this.render();
    }
  }

  removeTransaction(id) {
    for (let i = 0; i < this.incomeList.length; i++) {
      if (this.incomeList[i].id == id) {
        this.incomeList.splice(i, 1);
        this.id--;
      }
    }
    for (let i = 0; i < this.expenseList.length; i++) {
      if (this.expenseList[i].id == id) {
        this.expenseList.splice(i, 1);
        this.id--;
      }
    }
    this.render();
  }

  totalTransaction() {
    return this.totalIncome() + this.totalExpense();
  }

  totalIncome() {
    let total = 0;
    for (let transaction of this.incomeList) {
      total += transaction.amount;
    }
    return total;
  }

  expensePercentage() {
    let result = (this.totalExpense() / this.totalIncome()) * 100;
    if (result < 0) {
      return result * -1;
    }
    return result;
  }

  totalExpense() {
    let total = 0;
    for (let transaction of this.expenseList) {
      total += transaction.amount;
    }
    return total;
  }

  render() {
    incomeTransactionList.innerHTML = "";
    expenseTransactionList.innerHTML = "";
    for (let transaction of this.incomeList) {
      incomeTransactionList.innerHTML += transaction.incomeToHTML();
    }
    for (let transaction of this.expenseList) {
      expenseTransactionList.innerHTML += transaction.expenseToHTML(
        this.totalIncome()
      );
    }
  }
}

let shortenedMonth = `${months[newDate.getMonth()].substring(0, 3)}`;

class Transaction {
  constructor(description, amount, id) {
    this.amount = amount;
    this.description = description;
    this.date = `${shortenedMonth}. ${newDate.getDate()}th, ${newDate.getUTCFullYear()}`;
    this.id = id;
  }

  incomeToHTML() {
    return `<div class="item" data-transaction-id="${this.id}">
    <div class="item__description">${this.description}</div>            
    <div class="right">
      <div class="item__value">+ $${this.amount.toFixed(2)}</div>
      <div class="item__delete">
        <button class="item__delete--btn">
          <i class="ion-ios-close-outline"></i>
        </button>
      </div>
    </div>
    <div class="item__date">${this.date}</div>
  </div>`;
  }

  expenseToHTML(totalOfIncome) {
    return `<div class="item" data-transaction-id="${this.id}">
    <div class="item__description">${this.description}</div>
    <div class="right">
      <div class="item__value">- $${(this.amount * -1).toFixed(2)}</div>
      <div class="item__percentage">${(
        (this.amount / totalOfIncome) *
        100 *
        -1
      ).toFixed(0)}%</div>
      <div class="item__delete">
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
      </div>
    </div>
    <div class="item__date">${this.date}</div>
  </div>`;
  }
}

let alist = new TransactionList();

// Eventlistener for submit button
submitButton.onclick = function (event) {
  event.preventDefault();
  alist.addNewTransaction(inputDescription.value, Number(inputValue.value));
  if (alist.totalTransaction().toFixed(2) > 0) {
    totalBudgetValue.innerHTML = `+ $${alist.totalTransaction().toFixed(2)}`;
  } else {
    totalBudgetValue.innerHTML = `- $${(alist.totalTransaction() * -1).toFixed(
      2
    )}`;
  }
  incomeTotalDisplay.innerHTML = `+ $${alist.totalIncome().toFixed(2)}`;
  expenseTotalDisplay.innerHTML = `- $${(alist.totalExpense() * -1).toFixed(
    2
  )}`;
  expensePercentageDisplay.innerHTML = `${alist
    .expensePercentage()
    .toFixed(0)}%`;
  inputDescription.value = "";
  inputValue.value = "";
};

// Eventlistner for income list
incomeTransactionList.onclick = function (event) {
  if (event.target.className === "ion-ios-close-outline") {
    let transactionId = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-transaction-id"
    );
    alist.removeTransaction(transactionId);
  }
  if (alist.totalTransaction().toFixed(2) > 0) {
    totalBudgetValue.innerHTML = `+ $${alist.totalTransaction().toFixed(2)}`;
  } else {
    totalBudgetValue.innerHTML = `- $${(alist.totalTransaction() * -1).toFixed(
      2
    )}`;
  }
  incomeTotalDisplay.innerHTML = `+ $${alist.totalIncome().toFixed(2)}`;
  expenseTotalDisplay.innerHTML = `- $${(alist.totalExpense() * -1).toFixed(
    2
  )}`;
  expensePercentageDisplay.innerHTML = `${alist
    .expensePercentage()
    .toFixed(0)}%`;
  inputDescription.value = "";
  inputValue.value = "";
};

// Eventlistener for expenses list
expenseTransactionList.onclick = function (event) {
  if (event.target.className === "ion-ios-close-outline") {
    let transactionId = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-transaction-id"
    );
    alist.removeTransaction(transactionId);
  }
  if (alist.totalTransaction().toFixed(2) > 0) {
    totalBudgetValue.innerHTML = `+ $${alist.totalTransaction().toFixed(2)}`;
  } else {
    totalBudgetValue.innerHTML = `- $${(alist.totalTransaction() * -1).toFixed(
      2
    )}`;
  }
  incomeTotalDisplay.innerHTML = `+ $${alist.totalIncome().toFixed(2)}`;
  expenseTotalDisplay.innerHTML = `- $${(alist.totalExpense() * -1).toFixed(
    2
  )}`;
  expensePercentageDisplay.innerHTML = `${alist
    .expensePercentage()
    .toFixed(0)}%`;
  inputDescription.value = "";
  inputValue.value = "";
};
