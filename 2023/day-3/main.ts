import { isNumber } from "https://deno.land/x/is_number@v1.6.1/mod.ts";

import { getInputLines } from "../../shared/utils.ts";

const lines = await getInputLines(2023, 3);

const linesToArray = lines.map((line) => {
  return line
    .match(/\.{1,}|[-%!@/\\^$&*()_+=|?><,;:]+|[0-9]+/g)
    ?.flat()
    .map((item) => {
      if (!isNaN(Number(item))) {
        return Number(item);
      }
      return item;
    });
});

const partsNumber = linesToArray.filter((line) => {
  if (!line) return false;
  let isPart = false;

  for (const [i, item] of Object.entries(line)) {
    const index = Number(i);

    if (!isNumber(item)) continue;

    const rowAbove = line[index - 1];
    const rowBellow = line[index + 1];

    const { length } = String(item);

    // const hasSymbolNextToIt = 
  }

  return isPart;
});

console.log(linesToArray);
