import { calculate } from "./calculator.js";

const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".opr-btn");
const resultBtn = document.querySelector(".result-btn");
const clearBtn = document.querySelector(".ac-btn");
const clearEntryBtn = document.querySelector(".ce-btn");
const backspaceBtn = document.querySelector(".bs-btn");
const decimalBtn = document.querySelector(".decimal-btn");
const eqnDisplay = document.querySelector(".cal-equation");
const resultDisplay = document.querySelector(".cal-result");

function parseValidInput(text) {
    const regex = /([-+÷×])/;
    return text
        .trim()
        .split(regex)
        .filter((token) => token !== "")
        .map((token) => {
            if (token === "×") return "*";
            else if (token === "÷") return "/";
            else return token;
        });
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
    let value = e.target.value;
    if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
    if (e.target.value === ".") e.target.disabled = true;
    if (["*", "+", "-", "/"].includes(e.target.value)) {
        decimalBtn.disabled = false;
        if (value === "*") value = "×";
        if (value === "/") value = "÷";
    }
    eqnDisplay.textContent += value;
}

function populateResultDisplay(text) {
    clearResultDisplay();
    if (text === "INVALID OPERATION") clearEquationDisplay();
    const textLength = `${text + ""}`.length;
    if (textLength > 18) {
    }
    resultDisplay.textContent = text;
}

function removeSingleCharacter() {
    let lastCharacterPos = eqnDisplay.textContent.length - 1;
    eqnDisplay.textContent = eqnDisplay.textContent.slice(0, lastCharacterPos);
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", populateEquationDisplay);
});

decimalBtn.addEventListener("click", populateEquationDisplay);

operatorBtns.forEach((btn) => {
    btn.addEventListener("click", populateEquationDisplay);
});

resultBtn.addEventListener("click", () => {
    const expression = parseValidInput(eqnDisplay.textContent);
    try {
        if (expression != "_") {
            console.log(expression);
            populateResultDisplay(calculate(expression));
        }
    } catch (error) {
        console.error(error);
    }
});
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
});
