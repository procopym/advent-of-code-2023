/*
--- Day 16: The Floor Will Be Lava ---
With the beam of light completely focused somewhere, the reindeer leads you deeper still into the Lava Production Facility. At some point, you realize that the steel facility walls have been replaced with cave, and the doorways are just cave, and the floor is cave, and you're pretty sure this is actually just a giant cave.

Finally, as you approach what must be the heart of the mountain, you see a bright light in a cavern up ahead. There, you discover that the beam of light you so carefully focused is emerging from the cavern wall closest to the facility and pouring all of its energy into a contraption on the opposite side.

Upon closer inspection, the contraption appears to be a flat, two-dimensional square grid containing empty space (.), mirrors (/ and \), and splitters (| and -).

The contraption is aligned so that most of the beam bounces around the grid, but each tile on the grid converts some of the beam's light into heat to melt the rock in the cavern.

You note the layout of the contraption (your puzzle input). For example:

.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....
The beam enters in the top-left corner from the left and heading to the right. Then, its behavior depends on what it encounters as it moves:

If the beam encounters empty space (.), it continues in the same direction.
If the beam encounters a mirror (/ or \), the beam is reflected 90 degrees depending on the angle of the mirror. For instance, a rightward-moving beam that encounters a / mirror would continue upward in the mirror's column, while a rightward-moving beam that encounters a \ mirror would continue downward from the mirror's column.
If the beam encounters the pointy end of a splitter (| or -), the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a - splitter would continue in the same direction.
If the beam encounters the flat side of a splitter (| or -), the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a | splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.
Beams do not interact with other beams; a tile can have many beams passing through it at the same time. A tile is energized if that tile has at least one beam pass through it, reflect in it, or split in it.

In the above example, here is how the beam of light bounces around the contraption:

>|<<<\....
|v-.\^....
.v...|->>>
.v...v^.|.
.v...v^...
.v...v^..\
.v../2\\..
<->-/vv|..
.|<<<2-|.\
.v//.|.v..
Beams are only shown on empty tiles; arrows indicate the direction of the beams. If a tile contains beams moving in multiple directions, the number of distinct directions is shown instead. Here is the same diagram but instead only showing whether a tile is energized (#) or not (.):

######....
.#...#....
.#...#####
.#...##...
.#...##...
.#...##...
.#..####..
########..
.#######..
.#...#.#..
Ultimately, in this example, 46 tiles become energized.

The light isn't energizing enough tiles to produce lava; to debug the contraption, you need to start by analyzing the current situation. With the beam starting in the top-left heading right, how many tiles end up being energized?

--- Part Two ---
As you try to work out what might be wrong, the reindeer tugs on your shirt and leads you to a nearby control panel. There, a collection of buttons lets you align the contraption so that the beam enters from any edge tile and heading away from that edge. (You can choose either of two directions for the beam if it starts on a corner; for instance, if the beam starts in the bottom-right corner, it can start heading either left or upward.)

So, the beam could start on any tile in the top row (heading downward), any tile in the bottom row (heading upward), any tile in the leftmost column (heading right), or any tile in the rightmost column (heading left). To produce lava, you need to find the configuration that energizes as many tiles as possible.

In the above example, this can be achieved by starting the beam in the fourth tile from the left in the top row:

.|<2<\....
|v-v\^....
.v.v.|->>>
.v.v.v^.|.
.v.v.v^...
.v.v.v^..\
.v.v/2\\..
<-2-/vv|..
.|<<<2-|.\
.v//.|.v..
Using this configuration, 51 tiles are energized:

.#####....
.#.#.#....
.#.#.#####
.#.#.##...
.#.#.##...
.#.#.##...
.#.#####..
########..
.#######..
.#...#.#..
Find the initial beam configuration that energizes the largest number of tiles; how many tiles are energized in that configuration?
*/
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const file = process.argv[2];
const input = fs.readFileSync(file, "utf-8");

const grid = input.split("\n").map((x) => x.split(""));

function isValidMove(grid, i, j) {
  if (i < 0 || i >= grid.length || j < 0 || j >= grid[i].length) {
    return false;
  }

  return true;
}

const moves = [];
function nextMoves(grid, i, j, direction) {
  moves.length = 0;
  if (grid[i][j] === ".") {
    switch (direction) {
      case "right": {
        moves.push([i, j + 1, direction]);
        break;
      }
      case "left": {
        moves.push([i, j - 1, direction]);
        break;
      }
      case "up": {
        moves.push([i - 1, j, direction]);
        break;
      }
      case "down": {
        moves.push([i + 1, j, direction]);
        break;
      }
    }
  } else if (grid[i][j] === "|") {
    switch (direction) {
      case "right":
      case "left": {
        moves.push([i - 1, j, "up"]);
        moves.push([i + 1, j, "down"]);
        break;
      }
      case "up": {
        moves.push([i - 1, j, direction]);
        break;
      }
      case "down": {
        moves.push([i + 1, j, direction]);
        break;
      }
    }
  } else if (grid[i][j] === "-") {
    switch (direction) {
      case "up":
      case "down": {
        moves.push([i, j + 1, "right"]);
        moves.push([i, j - 1, "left"]);
        break;
      }
      case "right": {
        moves.push([i, j + 1, direction]);
        break;
      }
      case "left": {
        moves.push([i, j - 1, direction]);
        break;
      }
    }
  } else if (grid[i][j] === "/") {
    switch (direction) {
      case "up": {
        moves.push([i, j + 1, "right"]);
        break;
      }
      case "down": {
        moves.push([i, j - 1, "left"]);
        break;
      }
      case "right": {
        moves.push([i - 1, j, "up"]);
        break;
      }
      case "left": {
        moves.push([i + 1, j, "down"]);
        break;
      }
    }
  } else if (grid[i][j] === "\\") {
    switch (direction) {
      case "up": {
        moves.push([i, j - 1, "left"]);
        break;
      }
      case "down": {
        moves.push([i, j + 1, "right"]);
        break;
      }
      case "right": {
        moves.push([i + 1, j, "down"]);
        break;
      }
      case "left": {
        moves.push([i - 1, j, "up"]);
        break;
      }
    }
  }

  return moves;
}

function isCycle(paths, newMove) {
  const [i, j, direction] = newMove;
  const key = `${i}_${j}_${direction}`;

  if (paths.has(key)) {
    return true;
  } else {
    paths.add(key);
    return false;
  }
}

function show(grid, energized) {
  for (let i = 0; i < grid.length; i++) {
    const row = [];
    for (let j = 0; j < grid[i].length; j++) {
      if (energized.has(`${i}_${j}`)) {
        row.push("#");
      } else {
        row.push(".");
      }
    }

    console.log(row.join(""));
  }
}

function isEdge(grid, i, j) {
  if (i === 0 || j === 0) {
    return true;
  }

  if (i === grid.length - 1 || j === grid[i].length - 1) {
    return true;
  }

  return false;
}

const startingDirections = ["", ""];

function getStartingDirections(grid, i, j) {
  startingDirections.length = 0;

  if (i === 0) {
    startingDirections.push("down");
  }

  if (i === grid.length - 1) {
    startingDirections.push("up");
  }

  if (j === 0) {
    startingDirections.push("right");
  }
  if (j === grid[i].length - 1) {
    startingDirections.push("left");
  }

  return startingDirections;
}

let maxTiles = 0;
const paths = new Set();
const energized = new Set();
const beams = [];
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[i].length; j++) {
    if (!isEdge(grid, i, j)) {
      continue;
    }

    const sds = getStartingDirections(grid, i, j);
    for (const sd of sds) {
      paths.clear();
      energized.clear();
      beams.push([i, j, sd]);
      paths.add(`${i}_${j}_${sd}`);
      energized.add(`${i}_${j}`);
      while (beams.length > 0) {
        const beam = beams.pop();
        const moves = nextMoves(grid, ...beam);

        for (const move of moves) {
          const [i, j] = move;
          if (!isValidMove(grid, i, j)) {
            continue;
          }

          const key = `${i}_${j}`;
          energized.add(key);

          if (!isCycle(paths, move)) {
            beams.push(move);
          }
        }
      }

      if (i === 0 && j === 0 && sd === "right") {
        console.log("Part 1:", energized.size);
      }

      maxTiles = Math.max(maxTiles, energized.size);
    }
  }
}

console.log("Part 2:", maxTiles);
