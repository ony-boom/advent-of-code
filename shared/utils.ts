const getInput = async (year: number, day: number): Promise<string> => {
  const decoder = new TextDecoder("utf-8");

  const inputPath = `./${year}/day-${day}/input.txt`;

  const inputFile = await Deno.readFile(inputPath);

  return decoder.decode(inputFile);
};

export async function getInputLines(
  year: number,
  day: number,
): Promise<string[]>;
export async function getInputLines(
  year: number,
  day: number,
  splitByNewLine: true,
): Promise<string[]>;
export async function getInputLines(
  year: number,
  day: number,
  splitByNewLine: false,
): Promise<string>;
export async function getInputLines(
  year: number,
  day: number,
  splitByNewLine?: boolean,
): Promise<string[] | string> {
  const input = await getInput(year, day);

  if (splitByNewLine !== false) {
    return input.split("\n");
  }

  return input;
}
