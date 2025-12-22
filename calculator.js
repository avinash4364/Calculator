const ROUND_UPTO = 100000000;

function add(num1, num2) {
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
    } else if (operator === "*") {
        result = multiply(num1, num2);
    } else if (operator === "/") {
        result = divide(num1, num2);
    } else {
        return NaN;
    }
    return result;
}

function calculate(input) {
    console.log(input);
    if (input.length <= 1) {
        if (!isNaN(parseFloat(input[0]))) {
            return input[0];
        } else return "INVALID OPERATION";
    } else if (input.length == 2) {
        if (
            input[0] === "+" ||
            (input[0] === "-" && !isNaN(parseFloat(input[1])))
        ) {
            return `${input[0] === "-" ? -input[1] : input[1]}`;
        } else {
            return "INVALID OPERATION";
        }
    } else {
        const operatorArray = ["/", "*", "+", "-"];
        if (input[0] === "/" || input[0] === "*") {
            return "INVALID OPERATION";
        }

        if (input[0] === "+" || input[0] === "-") input.unshift("0");
        for (let i = 1; i < input.length; ) {
            if (input[i] === "-") {
                let num = input[i + 1];
                input.splice(i, 2, "+", `-${num}`);
            }
            i = i + 2;
        }

        let evenPos = 0;
        let oddPos = evenPos + 1;
        for (let i = 1; i < (input.length + 1) / 2; i++) {
            if (
                isNaN(input[evenPos]) ||
                !operatorArray.includes(input[oddPos])
            ) {
                return "INVALID OPERATION";
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
                        return "INVALID OPERATION";
                    }
                }
                j = j + 1;
            }
        }
        return input[0];
    }
}

if (typeof module !== "undefined") {
    module.exports = calculate;
}

module.exports = calculate;
