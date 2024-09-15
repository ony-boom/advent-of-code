import { getInputLines } from "../../shared/utils.ts";

const lines = await getInputLines(2023, 3);

const symbolRe = /[!@#$%^&*()_+{}\[\]:;"'<>,?/~`=|-]/;

let sum = 0;
const DEFAULT: {
  line: number;
  column: { index: number; value: string }[];
  upperLine: string;
  downLine: string;
  currenrtLine: string;
} = {
  line: -1,
  column: [],
  downLine: "",
  upperLine: "",
  currenrtLine: "",
};

let currentNum = DEFAULT;

const isSymbol = (str: string) => symbolRe.test(str);

const getEnginePart = () => {
  let value = 0;
  if (currentNum.line >= 0) {
    const columnValue = Number(
      currentNum.column.map(({ value }) => value).join(""),
    );
    const start = currentNum.column.at(0)!;
    const end = currentNum.column.at(-1)!;

    const startIndex = start.index - 1, endIndex = end.index + 1;

    if (
      isSymbol(currentNum.currenrtLine[startIndex]) ||
      isSymbol(currentNum.currenrtLine[endIndex])
    ) {
      value = columnValue;
      currentNum = DEFAULT;
      return value;
    }

    for (let index = startIndex; index <= endIndex; index++) {
      if (
        isSymbol(currentNum.upperLine?.[index]) ||
        isSymbol(currentNum.downLine?.[index])
      ) {
        value = columnValue;
        break;
      }
    }
  }

  currentNum = DEFAULT;
  return value;
};

for (const [lineIndex, line] of lines.entries()) {
  const splitedLine = line.split("");

  for (const [columnIndex, char] of splitedLine.entries()) {
    if (symbolRe.test(char)) {
      sum += getEnginePart() || 0;

      continue;
    }

    if (char === ".") {
      sum += getEnginePart() || 0;
      continue;
    }

    currentNum = {
      ...currentNum,
      line: lineIndex,
      downLine: lines[lineIndex + 1],
      upperLine: lines[lineIndex - 1],
      currenrtLine: lines[lineIndex],
      column: [...currentNum.column, {
        index: columnIndex,
        value: char,
      }],
    };
  }
}

console.log(sum);
