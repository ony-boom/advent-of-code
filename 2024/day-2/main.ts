import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 2);

const isListSafe = (line: number[]) => {
  const checkDirection = (ascending: boolean) =>
    line.every((val, idx) =>
      idx === line.length - 1 ||
      (ascending ? line[idx + 1] - val : val - line[idx + 1]) >= 1 &&
        (ascending ? line[idx + 1] - val : val - line[idx + 1]) <= 3
    );

  return checkDirection(true) || checkDirection(false);
};

const checkSafety = (line: number[]) => {
  if (isListSafe(line)) {
    return true;
  }

  for (let i = 0; i < line.length; i++) {
    const newLine = [...line.slice(0, i), ...line.slice(i + 1)];
    if (isListSafe(newLine)) {
      return true;
    }
  }

  return false;
};

export const getSafeReports = () => {
  let safeReportCount = 0;

  for (const line of lines) {
    const report = line.split(" ").map(Number);
    const isSafe = checkSafety(report);
    if (isSafe) {
      safeReportCount++;
    }
  }
  return safeReportCount;
};
