const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".opr-btn");
const resultBtn = document.querySelector(".result-btn");
const clearBtn = document.querySelector(".ac-btn");
const clearEntryBtn = document.querySelector(".ce-btn");
const backspaceBtn = document.querySelector(".bs-btn");
const display = document.querySelector(".cal-display");
let isDisplayPopulated = true; // global boolean variable to check if the display is populated at the current moment or not

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
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
    } else if (operator === "/") {
        result = divide(num1, num2);
    } else {
        console.log("Wrong operator");
    }
    return result;
}

function parseInput(text) {
    // const regex = /[+-*/]/; there is no valid character range from + to * unlike [a-z]
    const regex = /([+/*-])/; // () using capturing parenthesis matched results are included in the array , so +,-,*,/ are included in the array
    return text.trim().split(regex);
}

function clearDisplay() {
    display.textContent = "";
}

function clearEntry() {
    clearDisplay();
}

function populateDisplay(text) {
    if (display.textContent === "00000") {
        clearDisplay();
        isDisplayPopulated = false;
    }
    display.textContent += text;
}

function removeSingleCharacter() {
    display.textContent = display.textContent.slice(
        0,
        display.textContent.length - 1
    );
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        populateDisplay(e.target.getAttribute("data-key"));
    });
});

operatorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        populateDisplay(` ${e.target.getAttribute("data-key")}  `);
    });
});

resultBtn.addEventListener("click", () => {
    const input = parseInput(display.textContent);
    clearDisplay();
    if (input.length < 3) {
        populateDisplay("INVALID OPERATION");
    } else {
        let i = 0;
        let j = 2;
        let operator = 1;
        let result;
        while (j < input.length) {
            let firstOperand = result === undefined ? input[i] : result;
            result = operate(
                parseFloat(firstOperand),
                parseFloat(input[j]),
                input[operator].trim()
            );
            j = j + 2;
            operator = operator + 2;
            // console.log(input);
            console.log(result);
        }
        populateDisplay(result);
    }
    isDisplayPopulated = true;
});
clearBtn.addEventListener("click", clearDisplay);
clearEntryBtn.addEventListener("click", clearEntry);
backspaceBtn.addEventListener("click", () => {
    if (display.textContent.length > 0) removeSingleCharacter();
});
