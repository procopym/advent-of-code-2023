/*
--- Day 7: Camel Cards ---
Your all-expenses-paid trip turns out to be a one-way, five-minute ride in an airship. (At least it's a cool airship!) It drops you off at the edge of a vast desert and descends back to Island Island.

"Did you bring the parts?"

You turn around to see an Elf completely covered in white clothing, wearing goggles, and riding a large camel.

"Did you bring the parts?" she asks again, louder this time. You aren't sure what parts she's looking for; you're here to figure out why the sand stopped.

"The parts! For the sand, yes! Come with me; I will show you." She beckons you onto the camel.

After riding a bit across the sands of Desert Island, you can see what look like very large rocks covering half of the horizon. The Elf explains that the rocks are all along the part of Desert Island that is directly above Island Island, making it hard to even get there. Normally, they use big machines to move the rocks and filter the sand, but the machines have broken down because Desert Island recently stopped receiving the parts they need to fix the machines.

You've already assumed it'll be your job to figure out why the parts stopped when she asks if you can help. You agree automatically.

Because the journey will take a few days, she offers to teach you the game of Camel Cards. Camel Cards is sort of similar to poker except it's designed to be easier to play while riding a camel.

In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456
Hands are primarily ordered based on type; for example, every full house is stronger than any three of a kind.

If two hands have the same type, a second ordering rule takes effect. Start by comparing the first card in each hand. If these cards are different, the hand with the stronger first card is considered stronger. If the first card in each hand have the same label, however, then move on to considering the second card in each hand. If they differ, the hand with the higher second card wins; otherwise, continue with the third card in each hand, then the fourth, then the fifth.

So, 33332 and 2AAAA are both four of a kind hands, but 33332 is stronger because its first card is stronger. Similarly, 77888 and 77788 are both a full house, but 77888 is stronger because its third card is stronger (and both hands have the same first and second card).

To play Camel Cards, you are given a list of hands and their corresponding bid (your puzzle input). For example:

32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
This example shows five hands; each hand is followed by its bid amount. Each hand wins an amount equal to its bid multiplied by its rank, where the weakest hand gets rank 1, the second-weakest hand gets rank 2, and so on up to the strongest hand. Because there are five hands in this example, the strongest hand will have rank 5 and its bid will be multiplied by 5.

So, the first step is to put the hands in order of strength:

32T3K is the only one pair and the other hands are all a stronger type, so it gets rank 1.
KK677 and KTJJT are both two pair. Their first cards both have the same label, but the second card of KK677 is stronger (K vs T), so KTJJT gets rank 2 and KK677 gets rank 3.
T55J5 and QQQJA are both three of a kind. QQQJA has a stronger first card, so it gets rank 5 and T55J5 gets rank 4.
Now, you can determine the total winnings of this set of hands by adding up the result of multiplying each hand's bid with its rank (765 * 1 + 220 * 2 + 28 * 3 + 684 * 4 + 483 * 5). So the total winnings in this example are 6440.

Find the rank of every hand in your set. What are the total winnings?
*/

// const input = `32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483`;
import fs from "node:fs";

const input = fs.readFileSync("puzzle-input.txt", "utf-8");

let cards = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["J", 11],
  ["T", 10],
  ["9", 9],
  ["8", 8],
  ["7", 7],
  ["6", 6],
  ["5", 5],
  ["4", 4],
  ["3", 3],
  ["2", 2],
]);

const combinations = new Map([
  ["five-of-kind", 7],
  ["four-of-kind", 6],
  ["full-house", 5],
  ["three-of-kind", 4],
  ["two-pair", 3],
  ["one-pair", 2],
  ["high-card", 1],
]);

console.time("input");
const games = input
  .split("\n")
  .map((x) => x.trim())
  .map((x) => {
    const parts = x.split(" ");

    return [parts[0].split(""), +parts[1]];
  });

console.timeEnd("input");

export function countCards(hand, map) {
  map.clear();
  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];
    if (map.has(card)) {
      map.set(card, map.get(card) + 1);
    } else {
      map.set(card, 1);
    }
  }
}
export const map = new Map();
function isFiveOfKind(hand, wildcard) {
  countCards(hand, map);

  for (let [key, value] of map) {
    if (value + (key === wildcard ? 0 : map.get(wildcard) ?? 0) === 5) {
      return true;
    }
  }

  return false;
}

function isFourOfKind(hand, wildcard) {
  countCards(hand, map);

  for (let [key, value] of map) {
    if (value + (key === wildcard ? 0 : map.get(wildcard) ?? 0) === 4) {
      return true;
    }
  }

  return false;
}

function isFullHouse(hand, wildcard) {
  countCards(hand, map);

  const count = map.get(wildcard) ?? 0;
  if (count >= 1) {
    let pairs = 0;
    for (let [_, value] of map) {
      if (value >= 2) {
        pairs++;
      }
    }
    return pairs >= 2;
  }

  let set = false;
  let pair = false;
  for (let [_, value] of map) {
    if (value === 2) {
      pair = true;
    }

    if (value === 3) {
      set = true;
    }
  }

  return set && pair;
}

function isThreeOfKind(hand, wildcard) {
  countCards(hand, map);

  for (let [key, value] of map) {
    if (key === wildcard) {
      continue;
    }

    if (value + (map.get(wildcard) ?? 0) === 3) {
      return true;
    }
  }

  return false;
}

function isTwoPairs(hand, wildcard) {
  countCards(hand, map);

  if (typeof wildcard !== "undefined" && (map.get(wildcard) ?? 0) > 0) {
    return false;
  }

  let pairs = 0;
  for (let [_, value] of map) {
    if (value === 2) {
      pairs++;
    }
  }

  return pairs === 2;
}

function isOnePair(hand, wildcard) {
  countCards(hand, map);

  for (let [key, value] of map) {
    if (key === wildcard) {
      continue;
    }

    if (value + (map.get(wildcard) ?? 0) === 2) {
      return true;
    }
  }

  return false;
}

function is(hand, wildcard) {
  switch (true) {
    case isFiveOfKind(hand, wildcard):
      return "five-of-kind";
    case isFourOfKind(hand, wildcard):
      return "four-of-kind";
    case isFullHouse(hand, wildcard):
      return "full-house";
    case isThreeOfKind(hand, wildcard):
      return "three-of-kind";
    case isTwoPairs(hand, wildcard):
      return "two-pair";
    case isOnePair(hand, wildcard):
      return "one-pair";
    default:
      return "high-card";
  }
}

function power(combination, hand, powers) {
  let sum = combinations.get(combination) * 10 ** (hand.length + 1);

  for (let i = 0; i < hand.length; i++) {
    sum = sum + powers.get(hand[i]) * 15 ** (hand.length - i - 1);
  }

  return sum;
}

console.time("part-1");
const resultsPart1 = [];
for (let i = 0; i < games.length; i++) {
  const [hand, bid] = games[i];
  const combination = is(hand);
  resultsPart1.push({
    bid,
    hand,
    combination,
    power: power(combination, hand, cards),
  });
}
resultsPart1.sort((a, b) => a.power - b.power);
console.timeEnd("part-1");

cards = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  ["T", 10],
  ["9", 9],
  ["8", 8],
  ["7", 7],
  ["6", 6],
  ["5", 5],
  ["4", 4],
  ["3", 3],
  ["2", 2],
  ["J", 1],
]);
console.time("part-2");
const resultsPart2 = [];
for (let i = 0; i < games.length; i++) {
  const [hand, bid] = games[i];
  const combination = is(hand, "J");
  resultsPart2.push({
    bid,
    hand,
    combination,
    power: power(combination, hand, cards),
  });
}
resultsPart2.sort((a, b) => a.power - b.power);
console.timeEnd("part-2");

console.log(
  "Part 1:",
  resultsPart1.reduce((prev, curr, index) => prev + curr.bid * (index + 1), 0)
);
console.log(
  "Part 2:",
  resultsPart2.reduce((prev, curr, index) => prev + curr.bid * (index + 1), 0)
);
