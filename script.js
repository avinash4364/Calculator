function add(num1, num2) {
    console.log(num1 + num2);
}

function subtract(num1, num2) {
    console.log(num1 - num2);
}

function divide(num1, num2) {
    console.log(num1 / num2);
}

function multiply(num1, num2) {
    console.log(num1 * num2);
}

function operate(num1, num2, operator) {
    if (operator === "+") add(num1, num2);
    else if (operator === "-") subtract(num1, num2);
    else if (operator === "*") multiply(num1, num2);
    else if (operator === "/") divide(num1, num2);
    else {
        console.log("Please enter a valid operator");
    }
}

// const regex = /[+-*/]/; there is no valid character range from + to * unlike [a-z]
const regex = /([+/*-])/; // () using capturing parenthesis matched results are included in the array
const expression = prompt("Enter an Operation").trim().split(regex);
operate(parseInt(expression[0]), parseInt(expression[2]), expression[1].trim());
