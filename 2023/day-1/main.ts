import { getInputLines } from "../../shared/utils.ts";

const wordToNumberMap: Map<string, string> = new Map([
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
]);

function sumCalibrationValues(lines: string[]) {
  let total = 0;

  for (const line of lines) {
    const matches = line.matchAll(
      /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/g
    );

    const digits = Array.from(matches)
      .flat()
      .map((digit) => wordToNumberMap.get(digit) || digit)
      .filter(Boolean);

    total += Number(`${digits[0]}${digits[digits.length - 1]}`);
  }

  return total;
}

const lines = await getInputLines(2023, 1);

console.log(sumCalibrationValues(lines));
