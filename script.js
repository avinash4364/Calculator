const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".opr-btn");
const resultBtn = document.querySelector(".result-btn");
const clearBtn = document.querySelector(".ac-btn");
const clearEntryBtn = document.querySelector(".ce-btn");
const backspaceBtn = document.querySelector(".bs-btn");
const decimalBtn = document.querySelector(".decimal-btn");
const eqnDisplay = document.querySelector(".cal-equation");
const resultDisplay = document.querySelector(".cal-result");

function add(num1, num2) {
    // round upto 3 places
    return Math.round((num1 + num2) * 1000) / 1000;
}

function subtract(num1, num2) {
    // round upto 3 places
    return Math.round((num1 - num2) * 1000) / 1000;
}

function divide(num1, num2) {
    // round upto 3 places
    return Math.round((num1 / num2) * 1000) / 1000;
}

function multiply(num1, num2) {
    // round upto 3 places
    return Math.round(num1 * num2 * 1000) / 1000;
}

function operate(num1, num2, operator) {
    let result;
    if (operator === "+") {
        result = add(num1, num2);
    } else if (operator === "-") {
        result = subtract(num1, num2);
    } else if (operator === "*") {
        result = multiply(num1, num2);
    } else if (operator === "÷") {
        result = divide(num1, num2);
    } else {
        populateDisplay("INVALID OPERATION", resultDisplay);
    }
    return result;
}

function parseInput(text) {
    let invalidKeysArray = ["", " ", "  ", "   ", "    "];
    // const regex = /[+-*/]/; there is no valid character range from + to * unlike [a-z]
    const regex = /([*+÷-])/; // () using capturing parenthesis matched results are included in the array , so +,-,*,/ are included in the array
    return text.trim().split(regex);
}

function calculateEquation() {
    const input = parseInput(eqnDisplay.textContent);
    // console.log(input);
    clearResultDisplay();
    if (input.length === 1) {
        if (["*", "+", "-", "÷"].includes(input[0])) {
            populateDisplay("INVALID OPERATION", resultDisplay);
        } else populateDisplay(input, resultDisplay);
    } else if (input.length === 2 || input[0] === "*" || input[0] === "÷") {
        clearEquationDisplay();
        populateDisplay("INVALID OPERATION", resultDisplay);
    } else {
        let i = 0;
        let j = 2;
        let operator = 1;
        let result;
        let firstOperand;
        try {
            if (input[0] === "") input.splice(0, 1, "0"); // array is prepended with 0 when the user enter a number like -2 or +2 at the start (which is a valid syntax)
            // console.log(input);

            while (j < input.length) {
                firstOperand = result === undefined ? input[i] : result;
                result = operate(
                    parseFloat(firstOperand),
                    parseFloat(input[j]),
                    input[operator].trim()
                );
                j = j + 2;
                operator = operator + 2;
            }
            if (result) {
                populateDisplay(result, resultDisplay);
            } else {
                populateDisplay("INVALID OPERATION", resultDisplay);
            }
        } catch (error) {
            console.log(error);
            populateDisplay("INVALID OPERATION", resultDisplay);
        }
    }
}

function clearResultDisplay() {
    resultDisplay.textContent = "";
}

function clearEquationDisplay() {
    eqnDisplay.textContent = "_";
}

function clearEverything() {
    eqnDisplay.textContent = "_";
    resultDisplay.textContent = "00000";
}

function populateDisplay(text, displayPosition) {
    if (displayPosition.textContent === "00000") {
        clearResultDisplay();
    }
    if (text === "INVALID OPERATION") clearEquationDisplay();
    displayPosition.textContent += text;
}

function removeSingleCharacter() {
    eqnDisplay.textContent = eqnDisplay.textContent.slice(
        0,
        eqnDisplay.textContent.length - 1
    );
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
        populateDisplay(e.target.getAttribute("data-key"), eqnDisplay);
    });
});

decimalBtn.addEventListener("click", (e) => {
    if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
    populateDisplay(".", eqnDisplay);
    e.target.disabled = true;
});

operatorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
        populateDisplay(` ${e.target.getAttribute("data-key")}  `, eqnDisplay);
        decimalBtn.disabled = false;
    });
});

resultBtn.addEventListener("click", () => {
    calculateEquation();
    if (decimalBtn.disabled) {
        decimalBtn.disabled = false;
    }
});

clearBtn.addEventListener("click", clearEverything);
clearEntryBtn.addEventListener("click", clearEquationDisplay);
backspaceBtn.addEventListener("click", () => {
    if (eqnDisplay.textContent.length > 0) removeSingleCharacter();
});
