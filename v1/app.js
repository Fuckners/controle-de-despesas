"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// variaveis
const transactionContainer = document.getElementById('transactions');
const transactionForm = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const balanceElement = document.getElementById('balance');
const minusElement = document.getElementById('money-minus');
const plusElement = document.getElementById('money-plus');
(function start() {
    const currentBalance = +localStorage.getItem('saldo') || 0;
    const currentIncome = +localStorage.getItem('receita') || 0;
    const currentExpense = +localStorage.getItem('despesa') || 0;
    balanceElement.innerText = `R$ ${currentBalance.toFixed(2)}`;
    plusElement.innerText = `R$ ${currentIncome.toFixed(2)}`;
    minusElement.innerText = `R$ ${currentExpense.toFixed(2)}`;
    const savedTransactions = JSON.parse(localStorage.getItem('transações')) || [];
    savedTransactions.forEach(({ id, name, amount }) => addTransactionDOM(id, name, amount));
})();
// "gambiarra" pra gerar o ID
function generateId() {
    const transactions = JSON.parse(localStorage.getItem('transações')) || [];
    let generatedId;
    do {
        generatedId = Math.floor(Math.random() * 10000);
    } while (transactions.some(({ id }) => id == generatedId));
    return generatedId;
}
function alterBalance(amount) {
    // adiciondo novo saldo
    const currentBalance = +localStorage.getItem('saldo');
    const newBalance = currentBalance + amount;
    localStorage.setItem('saldo', (newBalance).toString());
    balanceElement.innerText = `R$ ${newBalance.toFixed(2)}`;
    // caso o valor seja positivo
    if (amount > 0) {
        const currentIncome = +localStorage.getItem('receita');
        const newPlus = currentIncome + amount;
        localStorage.setItem('receita', newPlus.toString());
        plusElement.innerText = `R$ ${newPlus.toFixed(2)}`;
    }
    else {
        // caso o valor seja negativo
        const currentExpense = +localStorage.getItem('despesa');
        const newMinus = currentExpense + amount;
        localStorage.setItem('despesa', newMinus.toString());
        minusElement.innerText = `R$ ${newMinus.toFixed(2)}`;
    }
}
function addTransactionDOM(id, name, amount) {
    // transactionContainer.innerHTML += `
    // <li class="${amount < 0 ? 'minus' : 'plus'}">
    //     ${name} <span>${amount}</span><button class="delete-btn">x</button>
    // </li>`
    const contant = document.createElement('li');
    contant.classList.add(amount < 0 ? 'minus' : 'plus');
    const span = document.createElement('span');
    span.innerText = `${amount}`;
    const btn = document.createElement('button');
    btn.classList.add('delete-btn');
    btn.innerText = 'x';
    btn.addEventListener('click', () => removeTransaction(contant, id));
    contant.append(name, span, btn); // append pode adicionar string e ou elementos (podem ser mais de 1 ao mesmo tempo)
    // appendChild pode adicionar somente elementos
    transactionContainer.appendChild(contant);
    return () => {
        const transactions = JSON.parse(localStorage.getItem('transações')) || [];
        transactions.push({ id, name, amount });
        localStorage.setItem('transações', JSON.stringify(transactions));
    };
}
function removeTransaction(element, id) {
    element.remove();
    const transactions = JSON.parse(localStorage.getItem('transações')) || [];
    console.log(transactions);
    const transaction = transactions.filter((trans) => trans.id == id)[0];
    console.log(id);
    console.log(transaction);
    alterBalance(transaction.amount * -1);
    const filteredTransactions = transactions.filter((trans) => trans.id != id);
    localStorage.setItem('transações', JSON.stringify(filteredTransactions));
}
// função para testes
function reset() {
    localStorage.clear();
}
// funcionalidade para adicionar saldo quando enviar o formulário.
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTransactionDOM(generateId(), textInput.value, +amountInput.value)();
    alterBalance(+amountInput.value);
});
