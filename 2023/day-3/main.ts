import { getInputLines } from "../../shared/utils.ts";

const lines = await getInputLines(2023, 3);

const symbolRe = /[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`=|-]/;

let sum = 0;
const DEFAULT: {
  line: number;
  column: { index: number; value: string }[];
  upperLine: string;
  downLine: string;
} = {
  line: -1,
  column: [],
  downLine: "",
  upperLine: "",
};

let currentNum = DEFAULT;

const updateSum = () => {
  if (currentNum.line >= 0) {
    const start = currentNum.column.at(0)!;
    const end = currentNum.column.at(-1)!;

    // TODO: finish this mess
    const startIndex = start.index - 1, endIndex = end.index + 1;

    let isEnginePart = false;
  }

  currentNum = DEFAULT;
};

for (const [lineIndex, line] of lines.entries()) {
  const splitedLine = line.split("");

  for (const [columnIndex, char] of splitedLine.entries()) {
    if (symbolRe.test(char)) {
      updateSum();

      continue;
    }

    if (char === ".") {
      updateSum();
      continue;
    }

    currentNum = {
      ...currentNum,
      line: lineIndex,
      downLine: lines[lineIndex + 1],
      upperLine: lines[lineIndex - 1],
      column: [...currentNum.column, {
        index: columnIndex,
        value: char,
      }],
    };
  }
}

console.log(sum);
