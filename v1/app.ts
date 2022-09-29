export {}; // pro typescript não reclamar de ter 2 arquivos com os mesmos nomes de veriáveis

interface transaction {
    id :number
    name :string
    amount :number
}

// variaveis
const transactionContainer = document.getElementById('transactions') as HTMLDivElement;
const transactionForm = document.getElementById('form') as HTMLFormElement;
const textInput = document.getElementById('text') as HTMLInputElement;
const amountInput = document.getElementById('amount') as HTMLInputElement;

const balanceElement = document.getElementById('balance') as HTMLTitleElement;
const minusElement = document.getElementById('money-minus') as HTMLParagraphElement;
const plusElement = document.getElementById('money-plus') as HTMLParagraphElement;

(function start() :void {
    const currentBalance :number = +localStorage.getItem('saldo')! || 0;
    const currentIncome :number = +localStorage.getItem('receita')! || 0;
    const currentExpense :number = +localStorage.getItem('despesa')! || 0;

    balanceElement.innerText = `R$ ${currentBalance.toFixed(2)}`;
    plusElement.innerText = `R$ ${currentIncome.toFixed(2)}`;
    minusElement.innerText = `R$ ${currentExpense.toFixed(2)}`;

    const savedTransactions :Array<transaction> = JSON.parse(localStorage.getItem('transações')!) || [];

    savedTransactions.forEach(({ id, name, amount } :transaction) => addTransactionDOM(id, name, amount));
})();

// "gambiarra" pra gerar o ID
function generateId() :number {
    const transactions :Array<transaction> = JSON.parse(localStorage.getItem('transações')!) || [];
    let generatedId :number;

    do {
        generatedId = Math.floor(Math.random() * 10000);
        
    } while (transactions.some(({ id } :transaction) => id == generatedId));

    return generatedId;
}

function alterBalance(amount :number) :void {
    // adiciondo novo saldo
    const currentBalance :number = +localStorage.getItem('saldo')!;

    const newBalance :number = currentBalance + amount;
    
    localStorage.setItem('saldo', (newBalance).toString());
    balanceElement.innerText = `R$ ${newBalance.toFixed(2)}`

    // caso o valor seja positivo
    if (amount > 0) {
        const currentIncome :number = +localStorage.getItem('receita')!;

        const newPlus :number = currentIncome + amount;

        localStorage.setItem('receita', newPlus.toString());
        plusElement.innerText = `R$ ${newPlus.toFixed(2)}`;

    } else {
        // caso o valor seja negativo
        const currentExpense :number = +localStorage.getItem('despesa')!;

        const newMinus :number = currentExpense + amount;

        localStorage.setItem('despesa', newMinus.toString());
        minusElement.innerText = `R$ ${newMinus.toFixed(2)}`;
    }
}

function addTransactionDOM(id :number, name :string, amount :number) :Function {
    // transactionContainer.innerHTML += `
    // <li class="${amount < 0 ? 'minus' : 'plus'}">
    //     ${name} <span>${amount}</span><button class="delete-btn">x</button>
    // </li>`

    const contant :HTMLLIElement = document.createElement('li');
        contant.classList.add(amount < 0 ? 'minus' : 'plus');

    const span :HTMLSpanElement = document.createElement('span');
        span.innerText = `${amount}`;

    const btn :HTMLButtonElement = document.createElement('button');
        btn.classList.add('delete-btn');
        btn.innerText = 'x';
        btn.addEventListener('click', () :void => removeTransaction(contant, id));

    contant.append(name, span, btn); // append pode adicionar string e ou elementos (podem ser mais de 1 ao mesmo tempo)
    // appendChild pode adicionar somente elementos

    transactionContainer.appendChild(contant);

    return () => { // tentativa de usar currying, não sei se está certo, mas torço que sim
        const transactions :Array<transaction> = JSON.parse(localStorage.getItem('transações')!) || [];
        transactions.push({ id, name, amount });
        localStorage.setItem('transações', JSON.stringify(transactions));
    }
}

function removeTransaction(element :HTMLLIElement, id :number) {
    element.remove();
    const transactions :Array<transaction> = JSON.parse(localStorage.getItem('transações')!) || [];
    console.log(transactions);
    
    const transaction :transaction = transactions.filter((trans :transaction) => trans.id == id)[0];
    console.log(id);
    console.log(transaction);
    
    alterBalance(transaction.amount * -1);

    const filteredTransactions :Array<transaction> = transactions.filter((trans :transaction) => trans.id != id);
    
    localStorage.setItem('transações', JSON.stringify(filteredTransactions));
}

// função para testes
function reset() :void {
    localStorage.clear();
}

// funcionalidade para adicionar saldo quando enviar o formulário.
transactionForm.addEventListener('submit', (e :SubmitEvent) :void => {
    e.preventDefault();
    addTransactionDOM(generateId(), textInput.value, +amountInput.value)();
    alterBalance(+amountInput.value);
});