export const getInput = async (year: number, day: number): Promise<string> => {
  const decoder = new TextDecoder("utf-8");

  const inputPath = `./${year}/day-${day}/input.txt`;

  const inputFile = await Deno.readFile(inputPath);

  return decoder.decode(inputFile);
};

export const getInputLines = async (
  year: number,
  day: number,
): Promise<string[]> => {
  const input = await getInput(year, day);

  return input.split("\n");
};
