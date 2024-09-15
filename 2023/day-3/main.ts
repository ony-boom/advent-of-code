import { getInputLines } from "../../shared/utils.ts";

const lines = await getInputLines(2023, 3);

const symbolRe = /[!@#$%^&*()_+{}\[\]:;"'<>,?/~`=|-]/;

const DEFAULT_LINE: Lines = {
  index: -1,
  columns: [],
  downLine: "",
  upperLine: "",
  raw: "",
};

const isEnginePartSymbol = (str: string) => symbolRe.test(str);

const getEnginePartValue = (line: Lines) => {
  let value = 0;
  if (line.index < 0) return value;

  const partNumber = Number(
    line.columns.map(({ value }) => value).join(""),
  );
  const start = line.columns.at(0)!;
  const end = line.columns.at(-1)!;

  const startIndex = start.index - 1, endIndex = end.index + 1;

  if (
    isEnginePartSymbol(line.raw[startIndex]) ||
    isEnginePartSymbol(line.raw[endIndex])
  ) {
    return partNumber;
  }

  for (let index = startIndex; index <= endIndex; index++) {
    if (
      isEnginePartSymbol(line.upperLine?.[index]) ||
      isEnginePartSymbol(line.downLine?.[index])
    ) {
      value = partNumber;
      break;
    }
  }
  return value;
};

let sum = 0;
let currentLine = DEFAULT_LINE;

for (const [lineIndex, line] of lines.entries()) {
  const splitedLine = line.split("");

  for (const [columnIndex, char] of splitedLine.entries()) {
    if (symbolRe.test(char)) {
      sum += getEnginePartValue(currentLine);
      currentLine = DEFAULT_LINE;
      continue;
    }

    if (char === ".") {
      sum += getEnginePartValue(currentLine);
      currentLine = DEFAULT_LINE;
      continue;
    }

    currentLine = {
      ...currentLine,
      index: lineIndex,
      downLine: lines[lineIndex + 1],
      upperLine: lines[lineIndex - 1],
      raw: lines[lineIndex],
      columns: [...currentLine.columns, {
        index: columnIndex,
        value: char,
      }],
    };
  }
}

type Lines = {
  index: number;
  columns: { index: number; value: string }[];
  upperLine: string;
  downLine: string;
  raw: string;
};

console.log(sum);
