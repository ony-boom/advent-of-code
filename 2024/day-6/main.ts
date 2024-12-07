import { getInputLines, sleep } from "@utils";

type Coordinates = [number, number];
type GuardSymbol = "^" | ">" | "<" | "v";
type GuardDirection = "up" | "down" | "left" | "right";

class Guard {
  readonly passedCoordinates: Set<string> = new Set();
  private guardSymbol: GuardSymbol = "^";
  private obstacleSymbol = "#";
  readonly markerSymbol = "X";
  private guardPosition: Coordinates = [0, 0];

  readonly map: string[][] = [];

  constructor(inputs: string[]) {
    const { guardPosition, map, guardSymbol } = this.buildMap(inputs);

    this.guardPosition = guardPosition;
    this.map = map;
    this.guardSymbol = guardSymbol;

    this.updateGruardPassedCoordinates();
  }

  private updateGruardPassedCoordinates() {
    this.passedCoordinates.add(this.guardPosition.join(","));
  }

  private getGuardSymbol = (symbol: string): symbol is GuardSymbol => {
    return ["^", ">", "<", "v"].includes(symbol);
  };

  private get guardDirection(): GuardDirection {
    return {
      "^": "up",
      v: "down",
      "<": "left",
      ">": "right",
    }[this.guardSymbol] as GuardDirection;
  }

  private buildMap(
    inputs: string[],
  ): {
    guardPosition: Coordinates;
    map: string[][];
    guardSymbol: GuardSymbol;
  } {
    const map: string[][] = [];
    const guardPosition: Coordinates = [0, 0];
    let guardSymbol: GuardSymbol = "^";
    for (const [rowIndex, line] of inputs.entries()) {
      const splitLine = [];
      for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        const char = line[columnIndex];
        if (this.getGuardSymbol(char)) {
          guardPosition[0] = columnIndex;
          guardPosition[1] = rowIndex;
          guardSymbol = char;
        }
        splitLine.push(char);
      }
      map.push(splitLine);
    }

    return {
      guardPosition,
      map,
      guardSymbol,
    };
  }

  private isDone = () => {
    const [x, y] = this.guardPosition;
    const mapHeight = this.map.length;
    const mapWidth = this.map[0]?.length ?? 0;

    return x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1;
  };

  private nextGuardSymbol() {
    const symbols = ["^", ">", "v", "<"];
    return symbols[
      (symbols.indexOf(this.guardSymbol) + 1) % symbols.length
    ] as GuardSymbol;
  }

  private shouldTurnRight() {
    const [x, y] = this.guardPosition;
    const offsets: Record<string, [number, number]> = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };

    const offset = offsets[this.guardDirection];
    if (!offset) return false;

    const [dx, dy] = offset;
    return this.map[y + dy]?.[x + dx] === this.obstacleSymbol;
  }

  private moveGuard() {
    if (this.shouldTurnRight()) {
      this.guardSymbol = this.nextGuardSymbol();
      return;
    }

    const currentGuardDirection = this.guardDirection;
    const [x, y] = this.guardPosition;
    const newPosition = [...this.guardPosition] as Coordinates;

    switch (currentGuardDirection) {
      case "up":
        newPosition[1] = y - 1;
        break;
      case "down":
        newPosition[1] = y + 1;
        break;
      case "left":
        newPosition[0] = x - 1;
        break;
      case "right":
        newPosition[0] = x + 1;
        break;
    }

    this.map[y][x] = this.markerSymbol;
    this.map[newPosition[1]][newPosition[0]] = this.guardSymbol;

    this.guardPosition = newPosition;
    this.updateGruardPassedCoordinates();
  }

  async getTotalMoves(
    { illustrate, redrawDelay = 1000 }: {
      redrawDelay?: number;
      illustrate?: boolean;
    },
  ) {
    const drawFn = () => {
      if (illustrate) {
        console.clear();
        const map = this.map;
        for (const row of map) {
          console.log(row.join(""));
        }
      }
    };

    do {
      drawFn();
      this.moveGuard();
      if (illustrate) {
        await sleep(redrawDelay);
      }
    } while (!this.isDone());

    drawFn();
    return this.passedCoordinates.size;
  }
}

const guard = new Guard(await getInputLines(2024, 6));

const _moves = await guard.getTotalMoves({
  illustrate: false,
  redrawDelay: 500,
});

console.log(_moves);
