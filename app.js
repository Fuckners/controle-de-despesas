"use strict";
// variaveis
const transactionContainer = document.getElementById('transactions');
const transactionForm = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const balanceElement = document.getElementById('balance');
const minusElement = document.getElementById('money-minus');
const plusElement = document.getElementById('money-plus');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('prev');
let globalTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
let page = 0;
reloadTransactions();
function updateLocalStorageTransactions() {
    localStorage.setItem('transactions', JSON.stringify(globalTransactions));
    reloadTransactions();
}
function addItemToGlobalTransactionsArray(name, amount) {
    globalTransactions.push({ id: generateId(), name, amount });
    updateLocalStorageTransactions();
}
function removeItemGlobalTransactionsArray(id) {
    globalTransactions = globalTransactions.filter((trans) => trans.id !== id);
    updateLocalStorageTransactions();
}
function reloadTransactions() {
    minusElement.innerText = // R$ 00,00
        totalExpense(globalTransactions.map(({ amount }) => amount));
    plusElement.innerText = // R$ 00,00
        totalIncome(globalTransactions.map(({ amount }) => amount));
    balanceElement.innerText = // R$ 00,00
        totalBalance(globalTransactions.map(({ amount }) => amount));
    switchTransactionsDisplay();
}
;
// despesas
function totalExpense(transactionsAmount) {
    const expenseValues = transactionsAmount.filter((amount) => amount < 0);
    return formatedSumValues(expenseValues);
}
// receitas
function totalIncome(transactionsAmount) {
    const incomeValues = transactionsAmount.filter((amount) => amount > 0);
    return formatedSumValues(incomeValues);
}
// saldo atual
function totalBalance(transactionsAmount) {
    return formatedSumValues(transactionsAmount);
}
// somar valores
function formatedSumValues(values) {
    return values.length == 0 ? `R$ 00.00` :
        'R$' + values.reduce((prev, curr) => curr + prev).toFixed(2);
}
// gerador de ID
function generateId() {
    const transactions = JSON.parse(localStorage.getItem('transações')) || [];
    let generatedId;
    do {
        generatedId = Math.floor(Math.random() * 10000);
    } while (transactions.some(({ id }) => id == generatedId));
    return generatedId;
}
function addTransactionDOM({ id, name, amount }) {
    const contant = document.createElement('li');
    contant.classList.add(amount < 0 ? 'minus' : 'plus');
    const span = document.createElement('span');
    span.innerText = `${amount}`;
    const btn = document.createElement('button');
    btn.classList.add('delete-btn');
    btn.innerText = 'x';
    btn.addEventListener('click', () => removeItemGlobalTransactionsArray(id));
    contant.append(name, span, btn);
    transactionContainer.appendChild(contant);
}
// função para testes
function reset() {
    localStorage.clear();
}
function onHandleSubmit(event) {
    event.preventDefault();
    // atualizar localstorage
    addItemToGlobalTransactionsArray(textInput.value, +amountInput.value);
    textInput.value = amountInput.value = '';
}
function switchTransactionsDisplay(switchQtd = 0) {
    if (page + switchQtd <= globalTransactions.length - 4 && page + switchQtd >= 0) {
        page += switchQtd;
    }
    transactionContainer.innerHTML = '';
    globalTransactions.slice(page, page + 4).forEach(addTransactionDOM);
}
nextButton.addEventListener('click', () => switchTransactionsDisplay(1));
previousButton.addEventListener('click', () => switchTransactionsDisplay(-1));
// funcionalidade para adicionar saldo quando enviar o formulário.
transactionForm.addEventListener('submit', onHandleSubmit);
