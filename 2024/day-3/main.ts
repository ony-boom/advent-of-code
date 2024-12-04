import { getInputLines } from "@utils";

const input = await getInputLines(2024, 3, false);

type Prefix = "do()" | "don't()" | null;

function getNums(str: string) {
  return str.match(/\d+/g)!.map(Number) as [number, number];
}

export const getMulSums = () => {
  const re = /mul\(\d+,\d+\)/g;
  const allMulStr = input.match(re);
  const allMulNums = allMulStr!.map((str) => {
    return getNums(str);
  });

  return allMulNums.reduce((acc, [a, b]) => acc + a * b, 0);
};

export const getCorrectedMulSums = () => {
  const correctedRe = /(do\(\)|don't\(\)|mul\(\d+,\d+\))/g;
  const allMulStr = input.match(correctedRe) as string[];

  let previousPrefix: Prefix = null;
  let sum = 0;

  for (const numStr of allMulStr) {
    if (numStr === "don't()" || numStr === "do()") {
      previousPrefix = numStr as Prefix;
      continue;
    }

    if (previousPrefix === "don't()") {
      continue;
    }

    const [a, b] = getNums(numStr);

    sum += a * b;

    previousPrefix = null;
  }

  return sum;
};
