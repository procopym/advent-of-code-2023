/*
--- Day 18: Lavaduct Lagoon ---
Thanks to your efforts, the machine parts factory is one of the first factories up and running since the lavafall came back. However, to catch up with the large backlog of parts requests, the factory will also need a large supply of lava for a while; the Elves have already started creating a large lagoon nearby for this purpose.

However, they aren't sure the lagoon will be big enough; they've asked you to take a look at the dig plan (your puzzle input). For example:

R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
The digger starts in a 1 meter cube hole in the ground. They then dig the specified number of meters up (U), down (D), left (L), or right (R), clearing full 1 meter cubes as they go. The directions are given as seen from above, so if "up" were north, then "right" would be east, and so on. Each trench is also listed with the color that the edge of the trench should be painted as an RGB hexadecimal color code.

When viewed from above, the above example dig plan would result in the following loop of trench (#) having been dug out from otherwise ground-level terrain (.):

#######
#.....#
###...#
..#...#
..#...#
###.###
#...#..
##..###
.#....#
.######
At this point, the trench could contain 38 cubic meters of lava. However, this is just the edge of the lagoon; the next step is to dig out the interior so that it is one meter deep as well:

#######
#######
#######
..#####
..#####
#######
#####..
#######
.######
.######
Now, the lagoon can contain a much more respectable 62 cubic meters of lava. While the interior is dug out, the edges are also painted according to the color codes in the dig plan.

The Elves are concerned the lagoon won't be large enough; if they follow their dig plan, how many cubic meters of lava could it hold?
*/
import fs from "node:fs";

const file = process.argv[2];
const input = fs.readFileSync(file, "utf-8");

const plan = input.split("\n").map((x) => x.split(" "));

const moves = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

function pointsP1(plan) {
  const points = [[0, 0]];
  let x = 0;
  let y = 0;
  for (let i = 0; i < plan.length; i++) {
    const move = plan[i];
    const [dx, dy] = moves[move[0]];

    const count = +move[1];
    x = x + dx * count;
    y = y + dy * count;

    points.push([x, y]);
  }

  return points;
}

function pointsP2(plan) {
  const points = [[0, 0]];
  let x = 0;
  let y = 0;
  for (let i = 0; i < plan.length; i++) {
    const [, , hex] = plan[i];

    let count = 0;
    for (let j = 2; j < hex.length - 2; j++) {
      count += Math.floor(parseInt(hex[j], 16)) * 16 ** (hex.length - j - 3);
    }

    let direction = undefined;
    switch (hex[hex.length - 2]) {
      case "0":
        direction = "R";
        break;
      case "1":
        direction = "D";
        break;
      case "2":
        direction = "L";
        break;
      case "3":
        direction = "U";
        break;
    }

    const [dx, dy] = moves[direction];
    x = x + dx * count;
    y = y + dy * count;

    points.push([x, y]);
  }

  return points;
}

function border(points) {
  let border = 0;

  let x = 0;
  let y = 0;
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      x = points[i][0];
      y = points[i][1];
      continue;
    }

    const curr = points[i];
    border = border + (Math.abs(curr[0] - x) + Math.abs(curr[1] - y));

    x = curr[0];
    y = curr[1];
  }

  return border;
}

function area(points, border) {
  let area = 0;
  for (let j = 0; j < points.length - 1; j++) {
    area =
      area +
      (points[j][1] + points[j + 1][1]) * (points[j][0] - points[j + 1][0]);
  }
  area = Math.abs(area) / 2;

  const inner = Math.floor(area - Math.ceil(border / 2) + 1);

  return inner + border;
}

let points = pointsP1(plan);
console.log("Part 1:", area(points, border(points)));
points = pointsP2(plan);
console.log("Part 2:", area(points, border(points)));
