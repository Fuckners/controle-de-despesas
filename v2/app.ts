// interfaces / types
interface transaction {
    id :number
    name :string
    amount :number
}

type switchQtd = -1 | 0 | 1;

// variaveis
const transactionContainer = document.getElementById('transactions') as HTMLDivElement;
const transactionForm = document.getElementById('form') as HTMLFormElement;
const textInput = document.getElementById('text') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;

const balanceElement = document.getElementById('balance') as HTMLTitleElement;
const minusElement = document.getElementById('money-minus') as HTMLParagraphElement;
const plusElement = document.getElementById('money-plus') as HTMLParagraphElement;

const nextButton = document.getElementById('next') as HTMLButtonElement;
const previousButton = document.getElementById('prev') as HTMLButtonElement;

let globalTransactions :Array<transaction> = JSON.parse(localStorage.getItem('transactions')!) || [];

let page = 0;

reloadTransactions();

function updateLocalStorageTransactions() :void {
    localStorage.setItem('transactions', JSON.stringify(globalTransactions));
    reloadTransactions();
}

function addItemToGlobalTransactionsArray(name: string, amount: number) :void {
    globalTransactions.push({ id: generateId(), name, amount });
    updateLocalStorageTransactions();
}

function removeItemGlobalTransactionsArray(id :number) :void {
    globalTransactions = globalTransactions.filter((trans :transaction) => trans.id !== id);
    updateLocalStorageTransactions();
}

function reloadTransactions() :void {
    minusElement.innerText = // R$ 00,00
        totalExpense(globalTransactions.map(({ amount } :transaction) => amount));

    plusElement.innerText = // R$ 00,00
        totalIncome(globalTransactions.map(({ amount } :transaction) => amount));

    balanceElement.innerText = // R$ 00,00
        totalBalance(globalTransactions.map(({ amount } :transaction) => amount));

    switchTransactionsDisplay();
};

// despesas
function totalExpense(transactionsAmount :Array<number>) :string {
    const expenseValues = transactionsAmount.filter((amount :number) => amount < 0);
    return formatedSumValues(expenseValues);
}

// receitas
function totalIncome(transactionsAmount :Array<number>) :string {
    const incomeValues = transactionsAmount.filter((amount :number) => amount > 0);
    return formatedSumValues(incomeValues);
}

// saldo atual
function totalBalance(transactionsAmount :Array<number>) :string {
    return formatedSumValues(transactionsAmount);
}

// somar valores
function formatedSumValues(values :Array<number>) {
    return values.length == 0 ? `R$ 00.00` :
    'R$' + values.reduce((prev :number, curr :number) => curr + prev).toFixed(2);
}

// gerador de ID
function generateId() :number {
    const transactions :Array<transaction> = JSON.parse(localStorage.getItem('transações')!) || [];
    let generatedId :number;

    do {
        generatedId = Math.floor(Math.random() * 10000);
        
    } while (transactions.some(({ id } :transaction) => id == generatedId));

    return generatedId;
}

function addTransactionDOM({ id, name, amount } :transaction) :void {

    const contant :HTMLLIElement = document.createElement('li');
        contant.classList.add(amount < 0 ? 'minus' : 'plus');

    const span :HTMLSpanElement = document.createElement('span');
        span.innerText = `${amount}`;

    const btn :HTMLButtonElement = document.createElement('button');
        btn.classList.add('delete-btn');
        btn.innerText = 'x';
        btn.addEventListener('click', () :void => removeItemGlobalTransactionsArray(id));

    contant.append(name, span, btn);

    transactionContainer.appendChild(contant);
}

// função para testes
function reset() :void {
    localStorage.clear();
}

function onHandleSubmit(event :SubmitEvent) :void {
    event.preventDefault();

    // atualizar localstorage
    addItemToGlobalTransactionsArray(textInput.value, +amountInput.value);
    
    textInput.value = amountInput.value = '';
}

function switchTransactionsDisplay(switchQtd :switchQtd = 0) :void {
    
    if (page + switchQtd <= globalTransactions.length -4 && page + switchQtd >= 0) {
        page += switchQtd;

    }
    
    transactionContainer.innerHTML = '';
    globalTransactions.slice(page, page +4).forEach(addTransactionDOM)
}

nextButton.addEventListener('click', () => switchTransactionsDisplay(1));
previousButton.addEventListener('click', () => switchTransactionsDisplay(-1));

// funcionalidade para adicionar saldo quando enviar o formulário.
transactionForm.addEventListener('submit', onHandleSubmit);
