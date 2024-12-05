import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 4);
const matrix = lines.map((line) => line.split(""));

const extract = (
  reverse: boolean,
  rowsSize: number,
  colsSize: number,
  minDiagonalLength = 4,
): string[] => {
  const result: string[] = [];
  for (let k = 0; k < rowsSize + colsSize - 1; k++) {
    const diagonal: string[] = [];
    for (
      let i = Math.max(0, k - colsSize + 1);
      i < Math.min(rowsSize, k + 1);
      i++
    ) {
      const j = reverse ? colsSize - 1 - (k - i) : k - i;
      if (j >= 0 && j < colsSize) diagonal.push(matrix[i][j]);
    }
    if (diagonal.length >= minDiagonalLength) result.push(diagonal.join(""));
  }
  return result;
};

const extractAllDiagonals = (): string[] => {
  if (!matrix.length || !matrix[0].length) return [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  return [...extract(false, rows, cols), ...extract(true, rows, cols)];
};

export const getTotalXMasCount = () => {
  const getXMasCount = (input: string) => {
    const matches = input.match(/(?=(xmas|samx))/gi);
    return matches?.length || 0;
  };

  const sumXMasCounts = (inputs: string[]) =>
    inputs.reduce((acc, input) => acc + getXMasCount(input), 0);

  const matrixRows = lines;
  const matrixCols = matrix[0].map((_, i) =>
    matrix.map((row) => row[i]).join("")
  );
  const matrixDiagonals = extractAllDiagonals();

  return (
    sumXMasCounts(matrixRows) +
    sumXMasCounts(matrixCols) +
    sumXMasCounts(matrixDiagonals)
  );
};

export const getTotalX_MASCount = () => {
  const MAS_RE = /mas|sam/i;

  const get_X = (
    i: number,
    j: number,
    direction: "ltr" | "rtl",
  ): string => {
    const topRow = matrix[i - 1];
    const bottomRow = matrix[i + 1];

    const [topColOffset, bottomColOffset] = direction === "ltr"
      ? [-1, 1]
      : [1, -1];

    const topChar = topRow?.[j + topColOffset] ?? "";
    const bottomChar = bottomRow?.[j + bottomColOffset] ?? "";

    return topChar + matrix[i][j] + bottomChar;
  };

  let count = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== "A") continue;

      const ltr = get_X(i, j, "ltr");
      const rtl = get_X(i, j, "rtl");

      if (MAS_RE.test(ltr) && MAS_RE.test(rtl)) {
        count++;
      }
    }
  }

  return count;
};
