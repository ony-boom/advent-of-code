import { getInputLines } from "@utils";

class Calibrations {
  private equations: [number, number[]][] = [];
  private OPERATORS = ["+", "*", "||"] as const;

  private miniMathLib: Record<
    typeof this.OPERATORS[number],
    (a: number, b: number) => number
  > = {
    "+": (a, b) => a + b,
    "*": (a, b) => a * b,
    "||": (a, b) => Number(String(a) + String(b)),
  };

  constructor(lines: string[]) {
    for (const line of lines) {
      const [value, equation] = line.split(": ");
      this.equations.push([
        Number(value),
        equation.split(" ").map(Number),
      ]);
    }
  }

  private generateOperatorCombinations(
    numbers: number[],
    operators: string[],
  ): string[][] {
    if (numbers.length <= 1) {
      return [[]];
    }

    const combinations: string[][] = [];

    function generateCombos(
      currentCombination: string[],
      remainingSpots: number,
    ) {
      if (remainingSpots === 0) {
        combinations.push([...currentCombination]);
        return;
      }

      for (const operator of operators) {
        currentCombination.push(operator);
        generateCombos(currentCombination, remainingSpots - 1);
        currentCombination.pop();
      }
    }

    generateCombos([], numbers.length - 1);

    return combinations;
  }

  getCalibrationResult(
    operators: typeof this.OPERATORS[number][] = ["+", "*"],
  ) {
    let result = 0;
    for (const [value, numbers] of this.equations) {
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

    const operatorCombos = this.generateOperatorCombinations(
      numbers,
      operators,
    );

    for (const combo of operatorCombos) {
      const value = numbers.reduce((acc, number, index) => {
        const operator = combo[index - 1] as typeof operators[number];
        const value = this.miniMathLib[operator](acc, number);
        return value;
      });
      if (value === target) {
        isSolvable = true;
        break;
      }
    }

    return isSolvable;
  }
}

// const lines = await getInputLines(2024, 7);
// const calibrations = new Calibrations(lines);

// part 1: console.log(calibrations.getCalibrationResult(["*", "+", "||"]));
