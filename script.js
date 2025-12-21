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
    } else if (operator === "×") {
        result = multiply(num1, num2);
    } else if (operator === "÷") {
        result = divide(num1, num2);
    } else {
        populateResultDisplay("INVALID OPERATION", resultDisplay);
    }
    return result;
}

function parseInput(text) {
    let invalidKeysArray = ["", " ", "  ", "   ", "    "];
    // const regex = /[+-*/]/; there is no valid character range from + to * unlike [a-z]
    const regex = /([×+÷-])/; // () using capturing parenthesis matched results are included in the array , so +,-,*,/ are included in the array
    return text.trim().split(regex);
}

function calculateEquation() {
    const input = parseInput(eqnDisplay.textContent);
    console.log(input);
    clearResultDisplay();
    if (input.length === 1) {
        if (["×", "+", "-", "÷"].includes(input[0])) {
            populateResultDisplay("INVALID OPERATION", resultDisplay);
        } else populateResultDisplay(input, resultDisplay);
    } else if (input.length === 2 || input[0] === "×" || input[0] === "÷") {
        clearEquationDisplay();
        populateResultDisplay("INVALID OPERATION", resultDisplay);
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
                populateResultDisplay(result, resultDisplay);
            } else {
                populateResultDisplay("INVALID OPERATION", resultDisplay);
            }
        } catch (error) {
            console.log(error);
            populateResultDisplay("INVALID OPERATION", resultDisplay);
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

function populateEquationDisplay(e, usingKey) {
    let space = "";
    if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
    if (usingKey) {
        let key = e.key;
        if (key === ".") decimalBtn.disabled = true;
        if (["+", "-", "/", "*"].includes(key)) {
            space = " ";
            decimalBtn.disabled = false;
            if (key === "*") key = "×";
            if (key === "/") key = "÷";
        }
        eqnDisplay.textContent += `${space}${key}${space}`;
    } else {
        if (e.target.value === ".") e.target.disabled = true;
        if (["×", "+", "-", "÷"].includes(e.target.value)) {
            space = " ";
            decimalBtn.disabled = false;
        }
        eqnDisplay.textContent += `${space}${e.target.value}${space}`;
    }
}

function populateResultDisplay(text) {
    clearResultDisplay();
    if (text === "INVALID OPERATION") clearEquationDisplay();
    resultDisplay.textContent = text;
    if (decimalBtn.disabled) {
        decimalBtn.disabled = false;
    }
}

function removeSingleCharacter() {
    eqnDisplay.textContent = eqnDisplay.textContent.slice(
        0,
        eqnDisplay.textContent.length - 1
    );
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", populateEquationDisplay);
});

decimalBtn.addEventListener("click", populateEquationDisplay);

operatorBtns.forEach((btn) => {
    btn.addEventListener("click", populateEquationDisplay);
});

resultBtn.addEventListener("click", calculateEquation);
clearBtn.addEventListener("click", clearEverything);
clearEntryBtn.addEventListener("click", clearEquationDisplay);
backspaceBtn.addEventListener("click", () => {
    if (eqnDisplay.textContent.length > 0) removeSingleCharacter();
});

// keyboard support
window.addEventListener("keydown", (e) => {
    // console.log(e);
    if (
        !isNaN(parseInt(e.key)) ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/" ||
        e.key === "."
    ) {
        populateEquationDisplay(e, true);
    } else if (e.key === "Enter" || e.key === "=") calculateEquation();
    else if (e.code === "KeyC") clearEverything();
    else if (e.code === "Space") clearEquationDisplay();
    else console.log("Wrong Key Pressed");
});
