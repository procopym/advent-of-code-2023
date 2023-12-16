/*
--- Day 3: Gear Ratios ---
You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?

--- Part Two ---
The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/

// const input = `467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..`;

// `row - 1
// startIndex - 1               endIndex + 1
//                              row + 1
// `;

import fs from "node:fs";

const input = fs.readFileSync("part-2-data.txt", "utf-8");

const rows = input.split("\n");

const matrix = rows.map((x) => x.trim().split(""));

const results = [];
const gearsPowers = [];
const gearsMap = new Map();

function isRangePart(row, start, end, number) {
  let startI = row - 1 < 0 ? row : row - 1;
  let startJ = start - 1 < 0 ? start : start - 1;
  let endI = row + 1 >= matrix.length ? row : row + 1;
  let endJ = end + 1 >= matrix[endI].length ? end : end + 1;

  let isPart = false;
  for (let i = startI; i <= endI; i++) {
    for (let j = startJ; j <= endJ; j++) {
      if (i === row && j >= start && j <= end) {
        continue;
      }

      if (!isPart && !matrix[i][j].match(/[0-9]/) && matrix[i][j] !== ".") {
        isPart = true;
      }

      if (matrix[i][j] === "*") {
        const key = `${i}_${j}`;
        if (gearsMap.has(key)) {
          gearsPowers.push(gearsMap.get(key) * number);
        } else {
          gearsMap.set(key, number);
        }
      }
    }
  }

  return isPart;
}

console.time("loop");
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (!matrix[i][j].match(/[0-9]/)) {
      continue;
    }

    let startIndex = j;
    let endIndex = j;

    let number = 0;
    for (
      let k = startIndex;
      k < matrix[i].length && matrix[i][k].match(/[0-9]/);
      k++
    ) {
      endIndex = k;
      number = number * 10 + +matrix[i][k];
    }
    j = endIndex;

    const isPart = isRangePart(i, startIndex, endIndex, number);

    if (isPart) {
      results.push(number);
    }
  }
}
console.timeEnd("loop");

// sum the results
console.log(results.reduce((prev, curr) => prev + curr, 0));
console.log(gearsPowers.reduce((prev, curr) => prev + curr, 0));
