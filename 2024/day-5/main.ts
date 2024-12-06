import { getInputLines } from "@utils";

const lines = await getInputLines(2024, 5);

const processInput = (lines: string[]) => {
  const pageOrders: [number, number][] = [];
  const updates: number[][] = [];

  for (const line of lines) {
    if (line.match(/\d+\|\d+/)) {
      pageOrders.push(line.split("|").map(Number) as [number, number]);
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    updates.push(line.split(",").map(Number));
  }

  return { pageOrders, updates };
};

const getMiddlePage = (update: number[]) =>
  update[Math.floor(update.length / 2)];

const isUpdateValid = (pageOrders: [number, number][], update: number[]) => {
  const pagePositions = new Map(update.map((page, index) => [page, index]));

  for (const [start, end] of pageOrders) {
    if (
      pagePositions.has(start) && pagePositions.has(end) &&
      pagePositions.get(start)! > pagePositions.get(end)!
    ) {
      return false;
    }
  }

  return true;
};

const fixInvalidUpdate = (pageOrders: [number, number][], update: number[]) => {
  const pagePositions = new Map(update.map((page, index) => [page, index]));

  for (const [start, end] of pageOrders) {
    if (
      pagePositions.has(start) && pagePositions.has(end) &&
      pagePositions.get(start)! > pagePositions.get(end)!
    ) {
      const newUpdate = structuredClone(update);

      const startIndex = pagePositions.get(start)!;
      const endIndex = pagePositions.get(end)!;

      newUpdate[startIndex] = end;
      newUpdate[endIndex] = start;

      return fixInvalidUpdate(pageOrders, newUpdate);
    }
  }

  return update;
};

export const getValidUpdatesMiddlePageSum = () => {
  const { pageOrders, updates } = processInput(lines);
  return updates
    .filter((update) => isUpdateValid(pageOrders, update))
    .reduce((acc, update) => acc + getMiddlePage(update), 0);
};

export const getFixedUpdatesMiddlePageSum = () => {
  const { pageOrders, updates } = processInput(lines);
  return updates
    .filter((update) => !isUpdateValid(pageOrders, update))
    .map((update) => fixInvalidUpdate(pageOrders, update))
    .reduce((acc, update) => acc + getMiddlePage(update), 0);
};

console.log(getFixedUpdatesMiddlePageSum());
