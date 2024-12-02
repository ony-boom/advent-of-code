import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 2);

function checkSafety(line: number[]) {
    if (lines.length < 2) {
        return true;
    }

    let increasing = true;
    let decreasing = true;

    for (let i = 0; i < line.length - 1; i++) {
        if (line[i] >= line[i + 1]) {
            increasing = false;
        }
        if (line[i] <= line[i + 1]) {
            decreasing = false;
        }

        const diff = Math.abs(line[i] - line[i + 1]);

        if (!increasing && !decreasing || diff > 3) {
            return false;
        }
    }

    return increasing || decreasing;
}

let safeReportCount = 0;

for (const line of lines) {
    const report = line.split(" ").map(Number);
    const isSafe = checkSafety(report);
    if (isSafe) {
        safeReportCount++;
    }
}

console.log(safeReportCount);
