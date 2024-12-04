import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 4);
const matrix = lines.map((line) => line.split(""));

const extractDiagonals = () => {
  if (!matrix.length || !matrix[0].length) return [];

  const rows = matrix.length;
  const cols = matrix[0].length;
  const diagonals: string[] = [];

  for (let k = 0; k < rows + cols - 1; k++) {
    const diagonal: string[] = [];
    for (let i = Math.max(0, k - cols + 1); i < Math.min(rows, k + 1); i++) {
      const j = k - i;
      if (j >= 0 && j < cols) {
        diagonal.push(matrix[i][j]);
      }
    }
    if (diagonal.length) diagonals.push(diagonal.join(""));
  }

  for (let k = 0; k < rows + cols - 1; k++) {
    const diagonal: string[] = [];
    for (let i = Math.max(0, k - cols + 1); i < Math.min(rows, k + 1); i++) {
      const j = cols - 1 - (k - i);
      if (j >= 0 && j < cols) {
        diagonal.push(matrix[i][j]);
      }
    }
    if (diagonal.length) diagonals.push(diagonal.join(""));
  }

  return diagonals;
};

export const getTotalXMasCount = () => {
  const getXMasCount = (input: string) => {
    const matches = input.match(/xmas|samx/gi);
    return matches?.length || 0;
  };

  const matrixRows = lines;
  const matrixCols = matrix[0].map((_, i) =>
    matrix.map((row) => row[i]).join("")
  );
  const matrixDiagonals = extractDiagonals();

  const rowsCount = matrixRows.reduce(
    (acc, row) => acc + getXMasCount(row),
    0,
  );
  const colsCount = matrixCols.reduce(
    (acc, col) => acc + getXMasCount(col),
    0,
  );
  const diagonalsCount = matrixDiagonals.reduce(
    (acc, diagonal) => acc + getXMasCount(diagonal),
    0,
  );

  return rowsCount + colsCount + diagonalsCount;
};

console.log(getTotalXMasCount());
