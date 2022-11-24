'use strict';
// Do guzików
const itemNumber = document.getElementsByClassName('item-number');
const itemOperation = document.getElementsByClassName('item-operation');
const itemResult = document.getElementsByClassName('item-result');
const itemClear = document.getElementsByClassName('item-clear');
const itemFullClear = document.getElementsByClassName('item-fullClear');
const itemRemove = document.getElementsByClassName('item-remove');
const itemFactorization = document.getElementsByClassName('item-factorization');
const itemSum = document.getElementsByClassName('item-sum');

// Do odświeżania widoków
const history2 = document.getElementById("history2");
const history = document.getElementById("history");
const result = document.getElementById("result");

// Zmienne globalne
const stack = new Array();
let currentValue = "0";
let lastEnter = false;
let lastOperation = false;

// Nasłuchiwanie klawiszy
const numberButtons = Array.from(itemNumber);
numberButtons.forEach(btn => {
    btn.addEventListener("click", onNumberClick);
});
const operationButtons = Array.from(itemOperation);
operationButtons.forEach(btn => {
    btn.addEventListener("click", onOperationClick);
});
const enterButton = Array.from(itemResult);
enterButton.forEach(btn => {
    btn.addEventListener("click", onEnterClick);
});
const clearButton = Array.from(itemClear);
clearButton.forEach(btn => {
    btn.addEventListener("click", onClearClick);
});
const fullClearButton = Array.from(itemFullClear);
fullClearButton.forEach(btn => {
    btn.addEventListener("click", onFullClearClick);
});
const removeButton = Array.from(itemRemove);
removeButton.forEach(btn => {
    btn.addEventListener("click", onRemoveClick);
});
const factorizationButton = Array.from(itemFactorization);
factorizationButton.forEach(btn => {
    btn.addEventListener("click", onFactorizationClick);
});
const sumButton = Array.from(itemSum);
sumButton.forEach(btn => {
    btn.addEventListener("click", onSumClick);
});

// Operacje dwuargumentowe
const operations = {
    '+': (y,x) => x + y,
    '-': (y,x) => {
        if(x < y) return "error";
        else return x - y;
    },
    '*': (y,x) => x * y,
    '/': (y,x) => isNaN(Math.floor(x / y)) ? "error" : Math.floor(x / y),
    '%': (y,x) => isNaN(Math.floor(x % y)) ? "error" : Math.floor(x % y),
    '^': (y,x) => x ** y,
    "NWD": (y,x) => {
        if(Math.floor(x) == 0 || Math.floor(y) == 0){
            return "error";
        } 
        while(x !== y){
            if(x > y) x = x - y;
            else y = y - x;
        }
        return x;
    },
    "SWAP": (y,x) => {
        if(x == undefined || y == undefined) {
            if(x == undefined && y == undefined) stack.push(0);
            stack.push(0);
            return;
        }
        stack.push(y);
        return x;
    }
}

// adnotacja typu argumentu (aby program mógł podpowiadać)
/**
 * @param { InputEvent } event
 */

// Aktualizacja widoków
function refreshDisplays() {
    history2.innerHTML = stack.length >= 2 ? stack.slice(-2, stack.length - 1) : 0;
    history.innerHTML = stack.length >= 1 ? stack.slice(-1) : 0;
    result.innerHTML = currentValue;
}

// Efekt wciśnięcia liczby
function onNumberClick(event) {
    if(lastOperation === true){
        stack.push(currentValue);
        currentValue = "0";
        lastOperation = false;
    }
    if(currentValue === "0" || lastEnter === true || currentValue === "error"){
        currentValue = event.currentTarget.value;
        lastEnter = false;
    }  
    else currentValue += event.currentTarget.value;
    if(parseFloat(currentValue) > Number.MAX_SAFE_INTEGER){
        currentValue = "error";
        lastOperation = false;
    }
    console.log(stack);
    refreshDisplays();
};

// Wykonywanie operacji dwuargumentowych
function onOperationClick(event) {
    if(stack.length === 0 || currentValue === "error") return;
    lastOperation = true;
    stack.push(parseFloat(currentValue));
    currentValue = operations[event.currentTarget.value](stack.pop(),stack.pop());
    if (isNaN(currentValue) || currentValue === undefined || parseFloat(currentValue) > Number.MAX_SAFE_INTEGER) {
        currentValue = "error";
        lastOperation = false;
      }
    refreshDisplays();
}

//Enter - dodawanie liczby do stosu
function onEnterClick() {
    if(currentValue === "error") return;
    lastEnter = true;
    lastOperation = false;
    stack.push(parseFloat(currentValue));
    console.log(stack);
    refreshDisplays();
}

function onClearClick() {
    if(currentValue == "error"){
        currentValue = 0;
        lastOperation = true;
        refreshDisplays();
        return;
    }
    currentValue = currentValue.length === 1 ? "0" : currentValue.substring(0, currentValue.length - 1);
    lastEnter = false;
    lastOperation = false;
    refreshDisplays();
}

function onFullClearClick() {
    lastEnter = false;
    lastOperation = false;
    currentValue = "0";
    stack.length = 0;
    refreshDisplays();
}

function onRemoveClick() {
    lastEnter = true;
    lastOperation = false;
    if(stack.length === 0){
        currentValue = 0;
        refreshDisplays();
        return;
    } 
    currentValue = stack.pop();
    refreshDisplays();
}

// Rozkład liczby na liczby pierwsze
function onFactorizationClick() {
    if(currentValue === "0" || currentValue === "1" || currentValue === "2" || currentValue === "3"){
        currentValue = "error";
        lastOperation = false;
        refreshDisplays();
        return;
    }
    let num = parseFloat(currentValue);
    let results = [];
    let i = 2;
    let e = Math.floor(Math.sqrt(num));
    while (i <= e) {
        while ((num % i) == 0) {
            results.push(i);
            num = Math.floor(num/i);
            e = Math.floor(Math.sqrt(num));
        }
        i++;
    }
    if (num > 1) results.push(num);
    let mathJax = `\\(${currentValue} = `;
    let last;
    let power = 1;
    let firstAdded = false;

    for (let nums of results) {
        if (last === nums) {
        power++;
        }
        else if (last !== undefined) {
        if (firstAdded) {
            mathJax += ' \\times ';
        }
        mathJax += last;
        if (power > 1) {
            mathJax += `^${power}`
        }

        firstAdded = true;
        power = 1;
        }
        last = nums;
    }

    if (firstAdded) {
        mathJax += ' \\times ';
    }

    mathJax += last;
    if (power > 1) {
        mathJax += `^${power}`
    }

    mathJax += "\\)";

    result.innerText = mathJax;
    lastOperation = true;
    // console.log(results);
    MathJax.typeset();
}

function onSumClick() {
    if(parseFloat(currentValue) > 50000000){
        result.innerText = "Za dużo";
        return;
    }
    const factors2 = [];
    let n = parseFloat(currentValue);
    for(var i = 3; i <= n/2 ; i++){
        if(isPrime(i)){
            if(isPrime(n-i)){
                factors2.push(i);
                factors2.push(n-i);
                break;
            }
        }
    }
    var factorsText = "";
    for (var i = 0; i < factors2.length; i++){
        if(i == factors2.length - 1)
            factorsText += factors2[i];
        else 
            factorsText += factors2[i] + " + ";
    }
    result.innerText = currentValue + " = " + factorsText;
    // console.log(currentValue + " = " + factorsText);
    lastOperation = true;
}

function isPrime(n){
    var m = n/2;
    for(var i = 2; i <= m; i++){
        if(n % i == 0){
            return 0;
        }
    }
    return 1;
}