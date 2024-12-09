import { getInputLines } from "@utils";

class Calibrations {
  private equations: Map<number, number[]> = new Map();
  private OPERATORS = ["+", "-", "*", "/"] as const;

  private miniMathLib: Record<
    typeof this.OPERATORS[number],
    (a: number, b: number) => number
  > = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };

  constructor(lines: string[]) {
    for (const line of lines) {
      const [value, equation] = line.split(": ");
      this.equations.set(Number(value), equation.split(" ").map(Number));
    }
  }

  getCalibrationResult(
    operators: typeof this.OPERATORS[number][] = ["+", "*"],
  ) {
    let result = 0;
    for (const [value, numbers] of this.equations.entries()) {
      if (this.solvable(value, numbers, operators)) {
        result += value;
      }
    }
    return result;
  }

  private solvable(
    target: number,
    numbers: number[],
    operators: typeof this.OPERATORS[number][],
  ) {
    let isSolvable = false;

    const generateOperatorCombinations = (count: number): string[][] => {
      if (count === 0) return [[]];
      const smallerCombos = generateOperatorCombinations(count - 1);
      return smallerCombos.flatMap((combo) =>
        operators.map((op) => [...combo, op])
      );
    };

    const operatorCombos = generateOperatorCombinations(numbers.length - 1);

    for (const combo of operatorCombos) {
      const value = numbers.reduce((acc, number, index) => {
        return this.miniMathLib
          [combo[index - 1] as keyof typeof this.miniMathLib](acc, number);
      });
      if (value === target) {
        isSolvable = true;
        break;
      }
    }

    return isSolvable;
  }
}

const lines = await getInputLines(2024, 7);
const calibrations = new Calibrations(lines);

console.log(calibrations.getCalibrationResult(["*", "+"]));
