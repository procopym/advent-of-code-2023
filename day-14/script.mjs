/*
--- Day 14: Parabolic Reflector Dish ---
You reach the place where all of the mirrors were pointing: a massive parabolic reflector dish attached to the side of another large mountain.

The dish is made up of many small mirrors, but while the mirrors themselves are roughly in the shape of a parabolic reflector dish, each individual mirror seems to be pointing in slightly the wrong direction. If the dish is meant to focus light, all it's doing right now is sending it in a vague direction.

This system must be what provides the energy for the lava! If you focus the reflector dish, maybe you can go where it's pointing and use the light to fix the lava production.

Upon closer inspection, the individual mirrors each appear to be connected via an elaborate system of ropes and pulleys to a large metal platform below the dish. The platform is covered in large rocks of various shapes. Depending on their position, the weight of the rocks deforms the platform, and the shape of the platform controls which ropes move and ultimately the focus of the dish.

In short: if you move the rocks, you can focus the dish. The platform even has a control panel on the side that lets you tilt it in one of four directions! The rounded rocks (O) will roll when the platform is tilted, while the cube-shaped rocks (#) will stay in place. You note the positions of all of the empty spaces (.) and rocks (your puzzle input). For example:

O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
Start by tilting the lever so all of the rocks will slide north as far as they will go:

OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....
You notice that the support beams along the north side of the platform are damaged; to ensure the platform doesn't collapse, you should calculate the total load on the north support beams.

The amount of load caused by a single rounded rock (O) is equal to the number of rows from the rock to the south edge of the platform, including the row the rock is on. (Cube-shaped rocks (#) don't contribute to load.) So, the amount of load caused by each rock in each row is as follows:

OOOO.#.O.. 10
OO..#....#  9
OO..O##..O  8
O..#.OO...  7
........#.  6
..#....#.#  5
..O..#.O.O  4
..O.......  3
#....###..  2
#....#....  1
The total load is the sum of the load caused by all of the rounded rocks. In this example, the total load is 136.

Tilt the platform so that the rounded rocks all roll north. Afterward, what is the total load on the north support beams?

--- Part Two ---
The parabolic reflector dish deforms, but not in a way that focuses the beam. To do that, you'll need to move the rocks to the edges of the platform. Fortunately, a button on the side of the control panel labeled "spin cycle" attempts to do just that!

Each cycle tilts the platform four times so that the rounded rocks roll north, then west, then south, then east. After each tilt, the rounded rocks roll as far as they can before the platform tilts in the next direction. After one cycle, the platform will have finished rolling the rounded rocks in those four directions in that order.

Here's what happens in the example above after each of the first few cycles:

After 1 cycle:
.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....

After 2 cycles:
.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O

After 3 cycles:
.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O
This process should work if you leave it running long enough, but you're still worried about the north support beams. To make sure they'll survive for a while, you need to calculate the total load on the north support beams after 1000000000 cycles.

In the above example, after 1000000000 cycles, the total load on the north support beams is 64.

Run the spin cycle for 1000000000 cycles. Afterward, what is the total load on the north support beams?
*/

// const input = `O....#....
// O.OO#....#
// .....##...
// OO.#O....O
// .O.....O#.
// O.#..O.#.#
// ..O..#O..O
// .......O..
// #....###..
// #OO..#....`;
import fs from "node:fs";

const input = fs.readFileSync("puzzle-input.txt", "utf-8");
function moveNorth(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "O") {
        let k = i - 1;
        let north = i;
        while (k >= 0 && grid[k][j] === ".") {
          north = k;
          k--;
        }

        const tmp = grid[north][j];
        grid[north][j] = grid[i][j];
        grid[i][j] = tmp;
      }
    }
  }
}

function moveEast(grid) {
  for (let i = grid[0].length - 1; i >= 0; i--) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === "O") {
        let k = i + 1;
        let east = i;
        while (k < grid[0].length && grid[j][k] === ".") {
          east = k;
          k++;
        }
        const tmp = grid[j][east];
        grid[j][east] = grid[j][i];
        grid[j][i] = tmp;
      }
    }
  }
}

function moveSouth(grid) {
  for (let i = grid.length - 1; i >= 0; i--) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "O") {
        let k = i + 1;
        let south = i;
        while (k < grid.length && grid[k][j] === ".") {
          south = k;
          k++;
        }

        const tmp = grid[south][j];
        grid[south][j] = grid[i][j];
        grid[i][j] = tmp;
      }
    }
  }
}

function moveWest(grid) {
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === "O") {
        let k = i - 1;
        let west = i;
        while (k >= 0 && grid[j][k] === ".") {
          west = k;
          k--;
        }

        const tmp = grid[j][west];
        grid[j][west] = grid[j][i];
        grid[j][i] = tmp;
      }
    }
  }
}

function calculate(grid) {
  let ans = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === "O") {
        ans += grid.length - i;
      }
    }
  }

  return ans;
}

function isCycle(timesteps, length) {
  let i = 1;
  while (i <= 19) {
    if (
      timesteps[timesteps.length - i] - timesteps[timesteps.length - i - 1] !==
      length
    ) {
      return false;
    }
    i++;
  }
  return true;
}

let grid = input.split("\n").map((x) => x.split(""));
const map = new Map();
const target = 1000000000;
for (let i = 0; i < target; i++) {
  for (let d of ["north", "west", "south", "east"]) {
    switch (d) {
      case "north": {
        moveNorth(grid);
        if (i == 0) {
          console.log("Part 1", calculate(grid));
        }
        break;
      }
      case "south": {
        moveSouth(grid);
        break;
      }
      case "west": {
        moveWest(grid);
        break;
      }
      case "east": {
        moveEast(grid);
        break;
      }
    }
  }

  const key = calculate(grid);
  if (map.has(key)) {
    map.get(key).push(i);
  } else {
    map.set(key, [i]);
  }

  const timesteps = map.get(key);
  if (timesteps.length >= 20) {
    const length =
      timesteps[timesteps.length - 1] - timesteps[timesteps.length - 2];
    if (isCycle(timesteps, length)) {
      const cycles = Math.floor((target - i) / length);
      i += cycles * length;
    }
  }
}

console.log("Part 2:", calculate(grid));
