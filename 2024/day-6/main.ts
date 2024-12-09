import { getInputLines, sleep } from "@utils";

type Coordinates = [number, number];
type GuardSymbol = "^" | ">" | "<" | "v";
type GuardDirection = "up" | "down" | "left" | "right";

class Guard {
  private static readonly GUARD_SYMBOLS: GuardSymbol[] = ["^", ">", "v", "<"];
  private static readonly DIRECTION_MAP: Record<GuardSymbol, GuardDirection> = {
    "^": "up",
    ">": "right",
    "v": "down",
    "<": "left",
  };

  private static readonly MOVEMENT_OFFSETS: Record<
    GuardDirection,
    Coordinates
  > = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };

  private readonly passedCoordinates = new Set<string>();
  private readonly passedCoordinatesWithDirection = new Map<string, number>();

  private guardSymbol: GuardSymbol = "^";
  private readonly obstacleSymbol = "#";
  private readonly markerSymbol = "X";
  private guardPosition: Coordinates = [0, 0];

  private map: string[][];
  private readonly initialState: {
    guardPosition: Coordinates;
    map: string[][];
    guardSymbol: GuardSymbol;
  };

  constructor(inputs: string[]) {
    const mapState = this.buildMap(inputs);
    this.initialState = structuredClone(mapState);

    const { guardPosition, map, guardSymbol } = mapState;
    this.guardPosition = guardPosition;
    this.map = map;
    this.guardSymbol = guardSymbol;

    this.updateGuardPassedCoordinates();
  }

  private reset() {
    this.map = structuredClone(this.initialState.map);
    this.guardPosition = [...this.initialState.guardPosition];
    this.guardSymbol = this.initialState.guardSymbol;
    this.passedCoordinatesWithDirection.clear();
  }

  private updateGuardPassedCoordinates() {
    const positionKey = this.guardPosition.join(",");
    this.passedCoordinates.add(positionKey);

    const directionKey = `${positionKey}-${this.guardDirection}`;
    this.passedCoordinatesWithDirection.set(
      directionKey,
      (this.passedCoordinatesWithDirection.get(directionKey) ?? 0) + 1,
    );
  }

  private get guardDirection(): GuardDirection {
    return Guard.DIRECTION_MAP[this.guardSymbol];
  }

  private buildMap(inputs: string[]) {
    const map: string[][] = [];
    const guardPosition: Coordinates = [0, 0];
    let guardSymbol: GuardSymbol = "^";

    inputs.forEach((line, rowIndex) => {
      const splitLine: string[] = line.split("").map((char) => {
        if (Guard.DIRECTION_MAP[char as GuardSymbol]) {
          guardPosition[0] = line.indexOf(char);
          guardPosition[1] = rowIndex;
          guardSymbol = char as GuardSymbol;
        }
        return char;
      });

      map.push(splitLine);
    });

    return { guardPosition, map, guardSymbol };
  }

  private isMapEdge() {
    const [x, y] = this.guardPosition;
    const mapHeight = this.map.length;
    const mapWidth = this.map[0]?.length ?? 0;

    return x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1;
  }

  private nextGuardSymbol() {
    const currentIndex = Guard.GUARD_SYMBOLS.indexOf(this.guardSymbol);
    return Guard.GUARD_SYMBOLS[(currentIndex + 1) % Guard.GUARD_SYMBOLS.length];
  }

  private shouldTurnRight() {
    const [x, y] = this.guardPosition;
    const [dx, dy] = Guard.MOVEMENT_OFFSETS[this.guardDirection];

    const nextCell = this.map[y + dy]?.[x + dx];
    return nextCell === this.obstacleSymbol || nextCell === "O";
  }

  private isInLoop() {
    if (this.isInitialGuardPosition(this.guardPosition)) {
      return false;
    }

    const key = `${this.guardPosition.join(",")}-${this.guardDirection}`;
    const visitCount = this.passedCoordinatesWithDirection.get(key) || 0;

    return visitCount > 1;
  }

  private moveGuard() {
    if (this.shouldTurnRight()) {
      this.guardSymbol = this.nextGuardSymbol();
      return;
    }

    const [x, y] = this.guardPosition;
    const [dx, dy] = Guard.MOVEMENT_OFFSETS[this.guardDirection];

    this.map[y][x] = this.markerSymbol;
    this.guardPosition = [x + dx, y + dy];
    this.map[this.guardPosition[1]][this.guardPosition[0]] = this.guardSymbol;

    this.updateGuardPassedCoordinates();
  }

  private isInitialGuardPosition = (position: Coordinates): boolean =>
    this.initialState.guardPosition.every((v, i) => position[i] === v);

  async findPossibleObstructionPositions() {
    let total = 0;

    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const cell = this.map[y][x];

        if (
          cell === this.obstacleSymbol || this.isInitialGuardPosition([x, y])
        ) {
          continue;
        }

        this.map[y][x] = "O";
        if (await this.simulate()) {
          total++;
        }
        this.map[y][x] = ".";
        this.reset();
      }
    }

    return total;
  }

  // deno-lint-ignore require-await
  private async simulate() {
    do {
      if (this.isInLoop()) {
        return true;
      }
      this.moveGuard();
    } while (!this.isMapEdge());

    return false;
  }

  private illustrate() {
    console.clear();
    for (let index = 0; index < this.map.length; index++) {
      const row = this.map[index];
      console.log(row.join(""));
    }
  }

  async getTotalMoves({ illustrate, redrawDelay = 1000 }: {
    redrawDelay?: number;
    illustrate?: boolean;
  }): Promise<number> {
    const drawFn = () => {
      if (illustrate) {
        this.illustrate();
      }
    };

    do {
      drawFn();
      this.moveGuard();
      if (illustrate) {
        await sleep(redrawDelay);
      }
    } while (!this.isMapEdge());

    drawFn();
    return this.passedCoordinates.size;
  }
}

async function main() {
  // const guard = new Guard(await getInputLines(2024, 6));
  // // const moves = await guard.getTotalMoves({ illustrate: false });
  // const start = performance.now();
  // const possibleObstructions = await guard.findPossibleObstructionPositions();
  // console.log({ possibleObstructions, duration: performance.now() - start });
}

main().catch(console.error);
