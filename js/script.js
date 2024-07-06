"use strict";

///////////////////////////////////////////////////
// ELEMENTS

const [navMsgEl] = document.getElementsByClassName("nav__msg");
const [usernameEl] = document.getElementsByClassName("nav__sgn-in__inp--user");
const [userpinEl] = document.getElementsByClassName("nav__sgn-in__inp--pin");
const [signinBtnEl] = document.getElementsByClassName("nav__sgn-in__btn");

const [balanceEl] = document.getElementsByClassName("balance");
const [timeDateEl] = document.getElementsByClassName(
  "balance__curr__date-time"
);
const [totalBalanceEl] = document.getElementsByClassName("balance__money");

const [moneyEl] = document.getElementsByClassName("money");
const [transactionTableEl] = document.getElementsByClassName("money__transact");
const [btnTransferEl] = document.getElementsByClassName(
  "money__request__itm__form__btn--transfer"
);
const [btnLoanEl] = document.getElementsByClassName(
  "money__request__itm__form__btn--loan"
);
const [btnCloseAccount] = document.getElementsByClassName(
  "money__request__itm__form__btn--close-account"
);
const [transferToInpEl] = document.getElementsByClassName(
  "money__request__itm__form__inp--transfer--user"
);
const [transferAmountInpEl] = document.getElementsByClassName(
  "money__request__itm__form__inp--transfer--amount"
);
const [loanAmountInpEl] = document.getElementsByClassName(
  "money__request__itm__form__inp--loan"
);
const [userCloseAccountInpEl] = document.getElementsByClassName(
  "money__request__itm__form__inp--close-account--user"
);
const [userConfirmPinInpEl] = document.getElementsByClassName(
  "money__request__itm__form__inp--close-account--pin"
);
const [totalInterestEl] = document.getElementsByClassName(
  "money__totals__interest__num"
);
const [totalINEl] = document.getElementsByClassName("money__totals__in__num");
const [totalOUTEl] = document.getElementsByClassName("money__totals__out__num");
const [sortBoxEl] = document.getElementsByClassName("money__totals__sort");
const [sortDownArrowEl] = document.getElementsByClassName(
  "money__totals__sort__arr-dwn"
);
const [sortUpArrowEl] = document.getElementsByClassName(
  "money__totals__sort__arr-up"
);
const [timerEl] = document.getElementsByClassName("money__time-out__time");

///////////////////////////////////////////////////
// FUNCTIONS

const clearInput = function (...inputs) {
  for (const input of inputs) {
    input.value = "";
    input.blur();
  }
};

const showInfo = function () {
  let opacityNumber = 0;
  balanceEl.style.opacity = opacityNumber;
  moneyEl.style.opacity = opacityNumber;
  balanceEl.classList.remove("remove");
  moneyEl.classList.remove("remove");
  const opacityTimer = setInterval(() => {
    opacityNumber += 0.05;
    balanceEl.style.opacity = opacityNumber;
    moneyEl.style.opacity = opacityNumber;
    if (opacityNumber > 0.95) {
      clearInterval(opacityTimer);
    }
  }, 50);
};

const removeInfo = function () {
  let opacityNumber = 1;
  const opacityTimer = setInterval(() => {
    opacityNumber -= 0.05;
    balanceEl.style.opacity = opacityNumber;
    moneyEl.style.opacity = opacityNumber;
    if (opacityNumber < 0.05) {
      clearInterval(opacityTimer);
      balanceEl.classList.add("remove");
      moneyEl.classList.add("remove");
    }
  }, 50);
};

const stratLogOutTimer = function () {
  const timeFormater = new Intl.DateTimeFormat("en-US", {
    minute: "numeric",
    second: "numeric",
  });
  const timerTime = new Date(0, 0, 0, 0, 10, 0);
  timerEl.textContent = timeFormater.format(timerTime);
  let counter = 1000;
  logOUtTimer = setInterval(() => {
    const timeString = timeFormater.format(timerTime - counter);
    timerEl.textContent = timeString;
    if (timeString === "00:00") {
      clearInterval(logOUtTimer);
      removeInfo();
    }
    counter += 1000;
  }, 1000);
};

const updateInterface = function (account) {
  const userFirstName = account.owner.split(" ")[0];
  const now = new Date();
  const nowHour = now.getHours();
  let greeting = "Good Evening";
  if (nowHour >= 5 && nowHour < 12) {
    greeting = "Good Morning";
  } else if (nowHour >= 12 && nowHour < 6) {
    greeting = "Good Afternoon";
  }
  navMsgEl.textContent = `${greeting}, ${userFirstName}!`;
  const internationalNumber = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  });
  const internationalTime = new Intl.DateTimeFormat(account.locale, {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
    // weekday: "short",
  });
  timeDateEl.textContent = `As of ${internationalTime.format(now)}`;
  const transactions = account.movements;
  let totalIN = transactions
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  let totalOUT = transactions
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  let totalInterest = transactions
    .filter((mov) => mov > 0)
    .map((dep) => (dep * account.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  totalIN = Number(totalIN.toFixed(2));
  totalOUT = Number(totalOUT.toFixed(2));
  totalInterest = Number(totalInterest.toFixed(2));
  let totalBalance = totalIN + totalInterest - totalOUT;
  totalBalance = Number(totalBalance.toFixed(2));
  account.balance = totalBalance;
  transactionTableEl.innerHTML = "";
  transactions.forEach(function (transaction, i) {
    const transactionDate = new Date(account.movementsDates[i]);
    const isItAWithdrawal = transaction < 0;
    const transactionHTML = `
    <div class="money__transact__itm">
     <div class="money__transact__itm__info ${
       isItAWithdrawal ? "withdrawal" : "deposit"
     }">
      <span class="money__transact__itm__info__num">${i + 1}</span>
      <span class="money__transact__itm__info__type">${
        isItAWithdrawal ? "WHITDRAWAL" : "DEPOSIT"
      }</span>
     </div>
     <span class="money__transact__itm__date">${internationalTime.format(
       transactionDate
     )}</span>
     <span class="money__transact__itm__num">${internationalNumber.format(
       transaction.toFixed(2)
     )}</span>
   </div>`;
    transactionTableEl.insertAdjacentHTML(
      sortLastUp ? "afterbegin" : "beforeend",
      transactionHTML
    );
  });
  totalINEl.textContent = internationalNumber.format(totalIN.toFixed(2));
  totalOUTEl.textContent = internationalNumber.format(totalOUT.toFixed(2));
  totalInterestEl.textContent = internationalNumber.format(
    totalInterest.toFixed(2)
  );
  totalBalanceEl.textContent = internationalNumber.format(
    totalBalance.toFixed(2)
  );
};

///////////////////////////////////////////////////
// GLOBAL VARIABLES

const accounts = [
  {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    username: "js",
    pin: 1111,
    movementsDates: [
      "2019-11-18T21:31:17.178Z",
      "2019-12-23T07:42:02.383Z",
      "2020-01-28T09:15:04.904Z",
      "2020-04-01T10:17:24.185Z",
      "2020-05-08T14:11:59.604Z",
      "2020-05-27T17:01:17.194Z",
      "2020-07-11T23:36:17.929Z",
      "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT",
  },
  {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    username: "jd",
    pin: 2222,
    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-11-30T09:48:16.867Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    username: "stw",
    pin: 3333,
    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-11-30T09:48:16.867Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-04-10T14:43:26.374Z",
      "2020-06-25T18:49:59.371Z",
      "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
  {
    owner: "Sara Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    username: "ss",
    pin: 4444,
    movementsDates: [
      "2019-11-01T13:15:33.035Z",
      "2019-12-25T06:04:23.907Z",
      "2020-01-25T14:18:46.235Z",
      "2020-02-05T16:33:06.386Z",
      "2020-06-25T18:49:59.371Z",
    ],
    currency: "USD",
    locale: "en-US",
  },
];

let currentAccount;
let sortLastUp = true;
let logOUtTimer;

///////////////////////////////////////////////////
//

signinBtnEl.addEventListener("click", function (event) {
  event.preventDefault();
  if (logOUtTimer) clearInterval(logOUtTimer);
  currentAccount = accounts.find(function (account) {
    return (
      account.username === usernameEl.value &&
      account.pin === Number(userpinEl.value)
    );
  });
  if (currentAccount !== undefined) {
    clearInput(usernameEl, userpinEl);
    stratLogOutTimer();
    updateInterface(currentAccount);
    showInfo();
  }
});

sortBoxEl.addEventListener("click", function () {
  sortLastUp = !sortLastUp;
  updateInterface(currentAccount);
  sortDownArrowEl.classList.toggle("remove");
  sortUpArrowEl.classList.toggle("remove");
});

btnTransferEl.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(logOUtTimer);
  stratLogOutTimer();
  const transferAmount = Number(transferAmountInpEl.value);
  const destinationAccount = accounts.find(function (account) {
    return account.username === transferToInpEl.value;
  });
  if (
    destinationAccount !== undefined &&
    currentAccount !== destinationAccount &&
    typeof transferAmount === "number" &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date());
    destinationAccount.movements.push(transferAmount);
    destinationAccount.movementsDates.push(new Date());
    clearInput(transferToInpEl, transferAmountInpEl);
    updateInterface(currentAccount);
  }
});

btnLoanEl.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(logOUtTimer);
  stratLogOutTimer();
  const loanAmount = Math.floor(loanAmountInpEl.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date());
      clearInput(loanAmountInpEl);
      updateInterface(currentAccount);
    }, 5000);
  }
});

btnCloseAccount.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    currentAccount.username === userCloseAccountInpEl.value &&
    currentAccount.pin === Number(userConfirmPinInpEl.value)
  ) {
    clearInput(userCloseAccountInpEl, userConfirmPinInpEl);
    const closingAccountIndex = accounts.findIndex(function (account) {
      return account === currentAccount;
    });
    accounts.splice(closingAccountIndex, 1);
    removeInfo();
  }
});

// let counter = 0;
// const timerTime = new Date(0, 0, 0, 0, 10, 0);
// const timeFormater = new Intl.DateTimeFormat("en-US", {
//   minute: "numeric",
//   second: "numeric",
// });
// setInterval(() => {
//   timeDateEl.textContent = timeFormater.format(timerTime - counter);
//   counter += 1000;
// }, 1000);

// setInterval(() => {
//   const newTime = new Date();

// }, 1000);

///////////////////////////////////////////////////
//practice

// currentAccount = accounts[0];
// updateInterface(currentAccount);
// showInfo();

// ${
//   isItAWithdrawal ? "-" : ""
// }$${Math.abs(transaction).toFixed(2)}
