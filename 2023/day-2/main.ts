import { getInputLines } from "../../shared/utils.ts";

const lines = await getInputLines(2023, 2);

class Game {
  id = 0;
  #bag: BagContent[] = [];

  maxCountPerCubes: Record<CubeColor, number> = {
    red: 12,
    blue: 14,
    green: 13,
  };

  constructor(private gameLine: string) {
    this.#setId();
    this.#makeBagContent();
  }

  get isPossible() {
    return this.#isGamePossible();
  }

  get power() {
    const { blue, green, red } = this
      .#getEachColorMinimalCountToMakeGamePossible();
    return red * blue * green;
  }

  get grouped() {
    return Object.groupBy(this.#bag, (set) => set.cubeColor);
  }

  #setId() {
    this.id = Number(this.gameLine.split(":")[0].split(" ").pop());
  }

  #isGamePossible() {
    let isPossible = true;

    for (const key in this.grouped) {
      const group = this.grouped[key as CubeColor]!;
      const maxCount = this.maxCountPerCubes[key as CubeColor];
      isPossible = isPossible && group.every((set) => set.count <= maxCount);
    }

    return isPossible;
  }

  #makeBagContent() {
    const stringBagContent = this.gameLine.split(":")[1].trim();
    const sets = stringBagContent.split(";");

    for (const set of sets) {
      const cubes = set.trim().split(", ");
      for (const cube of cubes) {
        const [count, color] = cube.split(" ");

        this.#bag.push({
          count: Number(count),
          cubeColor: color as CubeColor,
        });
      }
    }
  }

  #getEachColorMinimalCountToMakeGamePossible() {
    const eachColorMinimalCountToMakeGamePossible: Record<CubeColor, number> = {
      red: 0,
      blue: 0,
      green: 0,
    };

    for (const key in this.grouped) {
      const bag = this.grouped[key as CubeColor]!.map((set) => {
        return set.count;
      });

      eachColorMinimalCountToMakeGamePossible[key as CubeColor] = Math.max(
        ...bag,
      );
    }

    return eachColorMinimalCountToMakeGamePossible;
  }
}

let possibleGameIdSum = 0;
let powersSum = 0;

for (const [_i, line] of Object.entries(lines)) {
  // const index = Number(i) + 1;

  const game = new Game(line);
  powersSum += game.power;

  if (game.isPossible) {
    possibleGameIdSum += game.id;
  }
}

console.log({ possibleGameIdSum, powersSum });

type BagContent = {
  cubeColor: "red" | "green" | "blue";
  count: number;
};

type CubeColor = BagContent["cubeColor"];
