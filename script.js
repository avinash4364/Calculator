const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".opr-btn");
const resultBtn = document.querySelector(".result-btn");
const clearBtn = document.querySelector(".ac-btn");
const clearEntryBtn = document.querySelector(".ce-btn");
const backspaceBtn = document.querySelector(".bs-btn");
const decimalBtn = document.querySelector(".decimal-btn");
const eqnDisplay = document.querySelector(".cal-equation");
const resultDisplay = document.querySelector(".cal-result");

const ROUND_UPTO = 1000; // rounds operation involving decimal upto 3 places
function add(num1, num2) {
    // round upto 3 places
    return Math.round((num1 + num2) * ROUND_UPTO) / ROUND_UPTO;
}

function subtract(num1, num2) {
    return Math.round((num1 - num2) * ROUND_UPTO) / ROUND_UPTO;
}

function divide(num1, num2) {
    return Math.round((num1 / num2) * ROUND_UPTO) / ROUND_UPTO;
}

function multiply(num1, num2) {
    return Math.round(num1 * num2 * ROUND_UPTO) / ROUND_UPTO;
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

function parseValidInput(text) {
    const regex = /([-+÷×])/;
    return text
        .trim()
        .split(regex)
        .filter((token) => token !== "");
}

function calculate(input) {
    if (input.length <= 1) {
        if (!isNaN(parseFloat(input[0]))) {
            // 0,1,2,3,4,5,6,7,8,9 allowed

            populateResultDisplay(input[0]);
        } else if (input[0] === "_") return;
        else populateResultDisplay("INVALID OPERATION");
    } else if (input.length == 2) {
        if (
            input[0] === "+" ||
            (input[0] === "-" && !isNaN(parseFloat(input[1])))
        ) {
            // +1,-1 allowed
            populateResultDisplay(`${input[0] === "-" ? -input[1] : input[1]}`);
        } else {
            populateResultDisplay("INVALID OPERATION");
        }
    } else {
        const operatorArray = ["÷", "×", "+", "-"]; // order of operators following BODMAS rule
        try {
            if (input[0] === "÷" || input[0] === "×") {
                populateResultDisplay("INVALID OPERATION");
                return;
            }

            if (input[0] === "+" || input[0] === "-") input.unshift("0"); // makes -2+4*5 => 0-2+4*5 for our logic to work

            // Edge case : 0 - 2 + 5 returns -7 which is wrong
            // convert into 0 + (-2) + 5 returns 3
            for (let i = 1; i < input.length; ) {
                if (input[i] === "-") {
                    let num = input[i + 1];
                    input.splice(i, 2, "+", `-${num}`);
                }
                i = i + 2;
            }

            // check to see if user typed more than 2 numbers or 2 operators simultaneously
            let evenPos = 0;
            let oddPos = evenPos + 1;
            for (let i = 1; i < (input.length + 1) / 2; i++) {
                if (
                    isNaN(input[evenPos]) ||
                    !operatorArray.includes(input[oddPos])
                ) {
                    populateResultDisplay("INVALID OPERATION");
                }
                evenPos = evenPos + 2;
                oddPos = oddPos + 2;
            }

            outerLoop: for (let i = 0; i < operatorArray.length; i++) {
                let j = 1;
                while (j < input.length) {
                    let partialResult;
                    if (input[j] === operatorArray[i]) {
                        partialResult = operate(
                            parseFloat(input[j - 1]),
                            parseFloat(input[j + 1]),
                            input[j].trim()
                        );
                        if (!isNaN(partialResult) && isFinite(partialResult)) {
                            input.splice(j - 1, 3, partialResult);
                            j = j - 1;
                            if (input.length === 1) break outerLoop;
                        } else {
                            populateResultDisplay("INVALID OPERATION");
                            return;
                        }
                    }
                    j = j + 1;
                }
            }
            populateResultDisplay(input);
        } catch (error) {
            console.log(error);
            populateResultDisplay("INVALID OPERATION");
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
    let value = e.target.value;
    if (eqnDisplay.textContent === "_") eqnDisplay.textContent = "";
    if (e.target.value === ".") e.target.disabled = true;
    if (["*", "+", "-", "/"].includes(e.target.value)) {
        space = " ";
        decimalBtn.disabled = false;
        if (value === "*") value = "×";
        if (value === "/") value = "÷";
    }
    eqnDisplay.textContent += value;
}

function populateResultDisplay(text) {
    clearResultDisplay();
    if (text === "INVALID OPERATION") clearEquationDisplay();
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
    calculate(expression);
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
