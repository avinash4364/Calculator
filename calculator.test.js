import { calculate } from "./calculator.js";

describe("Calculator Stress Test", () => {
    const testCases = [
        // --- BASIC OPERATIONS ---
        { tokens: ["10", "+", "20"], expected: 30 },
        { tokens: ["50", "-", "20"], expected: 30 },
        { tokens: ["10", "*", "5"], expected: 50 },
        { tokens: ["100", "/", "4"], expected: 25 },

        // --- ORDER OF OPERATIONS (PEMDAS) ---
        { tokens: ["2", "+", "3", "*", "4"], expected: 14 },
        { tokens: ["10", "-", "2", "*", "3"], expected: 4 },
        { tokens: ["10", "/", "2", "+", "5"], expected: 10 },
        { tokens: ["20", "+", "10", "/", "2"], expected: 25 },
        { tokens: ["10", "+", "20", "*", "30", "/", "10"], expected: 70 },
        { tokens: ["5", "*", "5", "+", "5", "*", "5"], expected: 50 },

        // --- LONG EXPRESSIONS ---
        { tokens: ["1", "+", "2", "-", "3", "+", "4"], expected: 4 },
        { tokens: ["100", "/", "10", "*", "2", "/", "5"], expected: 4 },
        { tokens: ["2", "+", "2", "+", "2", "+", "2", "*", "0"], expected: 6 },
        { tokens: ["10", "*", "10", "*", "10", "/", "100"], expected: 10 },
        {
            tokens: ["1", "+", "1", "+", "1", "+", "1", "+", "1", "-", "10"],
            expected: -5,
        },

        // --- NEGATIVE NUMBERS & DECIMALS ---
        { tokens: ["-5", "+", "10"], expected: 5 },
        { tokens: ["10", "+", "-20"], expected: -10 },
        { tokens: ["-5", "*", "-5"], expected: 25 },
        { tokens: ["0.1", "+", "0.2"], expected: 0.3 }, // Watch for float precision!
        { tokens: ["10.5", "/", "2"], expected: 5.25 },
        { tokens: ["2.5", "*", "4"], expected: 10 },

        // --- EDGE CASES (ZERO & LARGE NUMBERS) ---
        { tokens: ["0", "*", "500"], expected: 0 },
        { tokens: ["0", "/", "10"], expected: 0 },
        { tokens: ["999999", "+", "1"], expected: 1000000 },
        { tokens: ["10", "/", "3"], expected: 3.3333333333 }, // Note: check your rounding logic

        // --- INVALID OPERATIONS (Should return "INVALID OPERATION") ---
        { tokens: ["10", "/", "0"], expected: "INVALID OPERATION" },
        { tokens: ["+", "10", "20"], expected: "INVALID OPERATION" },
        { tokens: ["10", "+"], expected: "INVALID OPERATION" },
        { tokens: ["*"], expected: "INVALID OPERATION" },
        { tokens: ["10", "20", "30"], expected: "INVALID OPERATION" },
        { tokens: ["10", "+", "+", "20"], expected: "INVALID OPERATION" },
        { tokens: ["/", "100"], expected: "INVALID OPERATION" },
        { tokens: ["10", "*", "/", "2"], expected: "INVALID OPERATION" },
        { tokens: [], expected: "INVALID OPERATION" },
        { tokens: ["apple", "+", "2"], expected: "INVALID OPERATION" },

        // --- COMPLEX MIXED ---
        {
            tokens: ["10", "+", "5", "*", "2", "-", "8", "/", "4"],
            expected: 18,
        },
        { tokens: ["100", "-", "50", "*", "2", "+", "10"], expected: 10 },
        { tokens: ["1", "+", "1", "/", "1", "*", "1", "-", "1"], expected: 1 },
        { tokens: ["50", "/", "2", "/", "5"], expected: 5 },
        { tokens: ["2", "*", "2", "*", "2", "*", "2", "*", "2"], expected: 32 },

        // --- SMOKE TESTS (REPETITIVE) ---
        {
            tokens: ["10", "+", "10", "+", "10", "+", "10", "+", "10"],
            expected: 50,
        },
        { tokens: ["100", "-", "10", "-", "10", "-", "10"], expected: 70 },
        { tokens: ["2", "*", "3", "*", "4"], expected: 24 },
        { tokens: ["120", "/", "2", "/", "3", "/", "2"], expected: 10 },
        { tokens: ["-1", "-", "1", "-", "1"], expected: -3 },
        { tokens: ["0.5", "*", "0.5"], expected: 0.25 },
        { tokens: ["10", "+", "0.00001"], expected: 10.00001 },
        { tokens: ["9", "/", "2", "+", "0.5"], expected: 5 },
        { tokens: ["1000", "/", "10", "+", "5", "*", "10"], expected: 150 },
        {
            tokens: ["1", "+", "2", "*", "3", "-", "4", "/", "5"],
            expected: 6.2,
        },
    ];

    test.each(testCases)(
        "calculating %p should return %s",
        ({ tokens, expected }) => {
            const result = calculate(tokens);

            // Special check for floating point numbers to avoid 0.30000000000000004 errors
            if (typeof result === "number" && typeof expected === "number") {
                expect(result).toBeCloseTo(expected, 8);
            } else {
                expect(result).toBe(expected);
            }
        }
    );
});
