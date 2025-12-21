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
    return Math.round((num1 - num2) * 1000) / 1000;
}

function divide(num1, num2) {
    return Math.round((num1 / num2) * 1000) / 1000;
}

function multiply(num1, num2) {
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
        populateResultDisplay("INVALID OPERATION");
    }
    return result;
}

function parseInput(text) {
    return text.trim().split(" ");
}

function calculateEquation() {
    const input = parseInput(eqnDisplay.textContent);
    console.log(input);
    clearResultDisplay();
    if (input.length === 1) {
        if (["×", "+", "-", "÷"].includes(input[0])) {
            populateResultDisplay("INVALID OPERATION");
        } else populateResultDisplay(input);
    } else if (input.length === 2) {
        clearEquationDisplay();
        if (input[0] === "×" || input[0] === "÷") {
            populateResultDisplay("INVALID OPERATION");
        } else {
            populateResultDisplay(input[1]);
        }
    } else {
        let i = 0;
        let j = 2;
        let operator = 1;
        let result;
        let firstOperand;
        try {
            if (input[0] === "+" || input[0] === "-") input.unshift("0"); // array is prepended with 0 when the user enter a number like -2 or +2 at the start (which is a valid syntax)

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
            if (!isNaN(result) && isFinite(result)) {
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
    if (decimalBtn.disabled) {
        decimalBtn.disabled = false;
    }
    resultDisplay.textContent = "";
}

function clearEquationDisplay() {
    if (decimalBtn.disabled) {
        decimalBtn.disabled = false;
    }
    eqnDisplay.textContent = "_";
}

function clearEverything() {
    if (decimalBtn.disabled) {
        decimalBtn.disabled = false;
    }
    eqnDisplay.textContent = "_";
    resultDisplay.textContent = "00000";
}

function populateEquationDisplay(e) {
    let space = "";
    let value = e.target.value;
    if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
    if (e.target.value === ".") e.target.disabled = true;
    if (["*", "+", "-", "/"].includes(e.target.value)) {
        space = " ";
        decimalBtn.disabled = false;
        if (value === "*") value = "×";
        if (value === "/") value = "÷";
    }
    eqnDisplay.textContent += `${space}${value}${space}`;
}

function populateResultDisplay(text) {
    clearResultDisplay();
    if (text === "INVALID OPERATION") clearEquationDisplay();
    resultDisplay.textContent = text;
}

function removeSingleCharacter() {
    let lastCharacterPos = eqnDisplay.textContent.length - 1;
    if (eqnDisplay.textContent.at(lastCharacterPos) === " ") lastCharacterPos--;
    eqnDisplay.textContent = eqnDisplay.textContent.slice(0, lastCharacterPos);
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
document.addEventListener("keydown", (e) => {
    if (
        !isNaN(parseInt(e.key)) ||
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/" ||
        e.key === "."
    ) {
        document.querySelector(`.btn[value="${e.key}"]`).click();
    } else if (e.key === "Enter" || e.key === "=")
        document.querySelector(`.btn[value="="]`).click();
    else if (e.code === "KeyC")
        document.querySelector(`.btn[value="c"]`).click();
    else if (e.code === "Space")
        document.querySelector(`.btn[value="space"]`).click();
    else if (e.code === "Backspace")
        document.querySelector(`.btn[value="backspace"]`).click();
    else console.log("Wrong Key Pressed");
});
