'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// all the accounts
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////
const displayMovements = function (movements, sort = false) {
  // first empty the movements container
  containerMovements.innerHTML = ''; // innerHTML is similar to the textcontent. the only difference is that text content only returns the text content of an element while innerHTML returns the whole element with html tags also.

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // sorting the array

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // template literals are amazing to create html like below
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}</div>
  </div>
`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// now to add this above generated html to a contianer, we will use insertadjacent element

///////////////
// computing usernames from the object
/////////////////
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      .join('');
  });
};

createUsernames(accounts);

/// calculating total balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// calculating in, out and interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const out = acc.movements
    .filter(val => val < 0)
    .map(val => Math.abs(val))
    .reduce((acc, val) => acc + val, 0);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${out}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// // using find method // this is really really powerful
// const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account);

// // doing same with for of loop
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// }

/// login feature
// Event handler
const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount;


btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting.

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // emptying the login fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // updating the ui
    updateUI(currentAccount);
  }
});

// transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => inputTransferTo.value === account.username
  );
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transefer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // upating the ui
    updateUI(currentAccount);
  }
});

// close account - find index method of array - works same as find, it returns the index of found eleemnt and note the element itself
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // to prevent it from ...

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // deleting the account
    accounts.splice(index, 1);

    // hiding the ui
    containerApp.style.opacity = 0;
  }

  // clearing the input fields.- it works only after reading the value from input field. this was a freaking bug.
  inputLoginUsername.value = inputLoginPin.value = '';
});

// some method -- requesting a bank loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    // Add the movement
    currentAccount.movements.push(amount);

    // update the ui
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

// using flat method to calculate the total movments.
const accountMovements = accounts.map(acc => acc.movements); // this will return an array of movements of different acconts
const allMovements = accountMovements.flat().reduce((acc, mov) => acc + mov, 0); // this will give total movements of all the accounts and sum it all up.
// console.log(allMovements);

// flatmap combines both flat and map methods of array
const overallBalance2 = accounts.flatMap(acc => acc.movements);
// console.log(overallBalance2);
// flatmap only goes 1 level deep and we cannot change it. for more nested use flat.

let isSorted = false;
// sorting movements
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});

// using arrays.from method
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);
});

// we can also use spread operator to convert nodelist to array
// but array.from is a nicer way to do so

/// Arryas method practice
// 1.
// storing all the movements into one big array
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0);

// console.log(bankDepositSum);

// 2. get all those movements which is at least 1000
// const numDeposits1000 = accounts
// .flatMap(acc => acc.movements)
// .filter(mov => mov >= 1000)
// .length

// console.log(numDeposits1000);

// other way using reduce
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);

// count + 1 = count++ would not work here hehe. we can use ++count here.
// console.log(numDeposits1000);

// let a = 10;
// console.log(a++);
// console.log(a);

// 3. create an object from reduce methods.
const { deposits, withdrawals } = accounts // imeediatly destructuring
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);

      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;

      return sums; // in the array funcitons, if we use a block then we need to explicitly write return keyword. never forget this.
    },
    { deposits: 0, withdrawals: 0 }
  );

// console.log(sums);
// console.log(deposits, withdrawals);

// 4. simple function that convert any string to title case
// this is a nice title -> This Is a Nice Title

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// adding dates
// day/month/year

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0); // zero based
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;


