/*
--- Day 19: Aplenty ---
The Elves of Gear Island are thankful for your help and send you on your way. They even have a hang glider that someone stole from Desert Island; since you're already going that direction, it would help them a lot if you would use it to get down there and return it to them.

As you reach the bottom of the relentless avalanche of machine parts, you discover that they're already forming a formidable heap. Don't worry, though - a group of Elves is already here organizing the parts, and they have a system.

To start, each part is rated in each of four categories:

x: Extremely cool looking
m: Musical (it makes a noise when you hit it)
a: Aerodynamic
s: Shiny
Then, each part is sent through a series of workflows that will ultimately accept or reject the part. Each workflow has a name and contains a list of rules; each rule specifies a condition and where to send the part if the condition is true. The first rule that matches the part being considered is applied immediately, and the part moves on to the destination described by the rule. (The last rule in each workflow has no condition and always applies if reached.)

Consider the workflow ex{x>10:one,m<20:two,a>30:R,A}. This workflow is named ex and contains four rules. If workflow ex were considering a specific part, it would perform the following steps in order:

Rule "x>10:one": If the part's x is more than 10, send the part to the workflow named one.
Rule "m<20:two": Otherwise, if the part's m is less than 20, send the part to the workflow named two.
Rule "a>30:R": Otherwise, if the part's a is more than 30, the part is immediately rejected (R).
Rule "A": Otherwise, because no other rules matched the part, the part is immediately accepted (A).
If a part is sent to another workflow, it immediately switches to the start of that workflow instead and never returns. If a part is accepted (sent to A) or rejected (sent to R), the part immediately stops any further processing.

The system works, but it's not keeping up with the torrent of weird metal shapes. The Elves ask if you can help sort a few parts and give you the list of workflows and some part ratings (your puzzle input). For example:

px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
The workflows are listed first, followed by a blank line, then the ratings of the parts the Elves would like you to sort. All parts begin in the workflow named in. In this example, the five listed parts go through the following workflows:

{x=787,m=2655,a=1222,s=2876}: in -> qqz -> qs -> lnx -> A
{x=1679,m=44,a=2067,s=496}: in -> px -> rfg -> gd -> R
{x=2036,m=264,a=79,s=2244}: in -> qqz -> hdj -> pv -> A
{x=2461,m=1339,a=466,s=291}: in -> px -> qkq -> crn -> R
{x=2127,m=1623,a=2188,s=1013}: in -> px -> rfg -> A
Ultimately, three parts are accepted. Adding up the x, m, a, and s rating for each of the accepted parts gives 7540 for the part with x=787, 4623 for the part with x=2036, and 6951 for the part with x=2127. Adding all of the ratings for all of the accepted parts gives the sum total of 19114.

Sort through all of the parts you've been given; what do you get if you add together all of the rating numbers for all of the parts that ultimately get accepted?

--- Part Two ---
Even with your help, the sorting process still isn't fast enough.

One of the Elves comes up with a new plan: rather than sort parts individually through all of these workflows, maybe you can figure out in advance which combinations of ratings will be accepted or rejected.

Each of the four ratings (x, m, a, s) can have an integer value ranging from a minimum of 1 to a maximum of 4000. Of all possible distinct combinations of ratings, your job is to figure out which ones will be accepted.

In the above example, there are 167409079868000 distinct combinations of ratings that will be accepted.

Consider only your list of workflows; the list of part ratings that the Elves wanted you to sort is no longer relevant. How many distinct combinations of ratings will be accepted by the Elves' workflows?
*/
import fs from "node:fs";

const file = process.argv[2];
const input = fs.readFileSync(file, "utf-8");

function parse(input) {
  let [workflowsRaw, data] = input.split("\n\n");

  const workflows = new Map();
  workflowsRaw = workflowsRaw.split("\n");
  for (let i = 0; i < workflowsRaw.length; i++) {
    const name = workflowsRaw[i].slice(0, workflowsRaw[i].indexOf("{"));
    const rules = workflowsRaw[i]
      .slice(workflowsRaw[i].indexOf("{") + 1, workflowsRaw[i].length - 1)
      .split(",");

    const workflow = {
      rules: [],
      default: rules[rules.length - 1],
    };
    for (let j = 0; j < rules.length - 1; j++) {
      const resultIndex = rules[j].indexOf(":");
      const value = +rules[j].slice(2, resultIndex);
      const result = rules[j].slice(resultIndex + 1);

      workflow.rules.push([rules[j][0], rules[j][1], value, result]);
    }
    workflows.set(name, workflow);
  }

  data = data.split("\n");
  const values = [];
  for (let i = 0; i < data.length; i++) {
    const xmas = data[i]
      .slice(1, data[i].length - 1)
      .split(",")
      .map((x) => +x.slice(x.indexOf("=") + 1));

    values.push(xmas);
  }

  return [workflows, values];
}

const mapping = {
  x: 0,
  m: 1,
  a: 2,
  s: 3,
};
function evaluate(values, rule) {
  const [letter, op, value, result] = rule;
  const index = mapping[letter];

  if (
    (op === ">" && values[index] > value) ||
    (op === "<" && values[index] < value)
  ) {
    return result;
  }

  return null;
}

const [workflows, values] = parse(input);

function validate(values, workflow) {
  let result = null;
  for (const rule of workflow.rules) {
    result = evaluate(values, rule);
    if (result) {
      break;
    }
  }

  if (!result) {
    result = workflow.default;
  }

  if (result === "R") {
    return 0;
  }

  if (result === "A") {
    return values.reduce((prev, curr) => prev + curr, 0);
  }

  return validate(values, workflows.get(result));
}

let ans = 0;
for (const value of values) {
  ans += validate(value, workflows.get("in"));
}
console.log("Part 1:", ans);

// inspired from https://github.com/jonathanpaulson/AdventOfCode/blob/master/2023/19.py
function newRange(operation, operand, low, high) {
  if (operation === ">") {
    low = Math.max(low, operand + 1);
  }
  if (operation === "<") {
    high = Math.min(high, operand - 1);
  }
  if (operation === ">=") {
    low = Math.max(low, operand);
  }
  if (operation === "<=") {
    high = Math.min(high, operand);
  }
  return [low, high];
}

function newRanges(letter, operation, operand, xl, xh, ml, mh, al, ah, sl, sh) {
  if (letter === "x") {
    [xl, xh] = newRange(operation, operand, xl, xh);
  }

  if (letter === "m") {
    [ml, mh] = newRange(operation, operand, ml, mh);
  }

  if (letter === "a") {
    [al, ah] = newRange(operation, operand, al, ah);
  }

  if (letter === "s") {
    [sl, sh] = newRange(operation, operand, sl, sh);
  }
  return [xl, xh, ml, mh, al, ah, sl, sh];
}

const signMapping = {
  ">": "<=",
  "<": ">=",
  "<=": ">",
  ">=": "<",
};
ans = 0;
const stack = [["in", 1, 4000, 1, 4000, 1, 4000, 1, 4000]];
while (stack.length > 0) {
  let [wf, xl, xh, ml, mh, al, ah, sl, sh] = stack.pop();
  if (xl > xh || ml > mh || al > ah || sl > sh) {
    continue;
  }
  if (wf === "R") {
    continue;
  }
  if (wf === "A") {
    const score = (xh - xl + 1) * (mh - ml + 1) * (ah - al + 1) * (sh - sl + 1);
    ans += score;
    continue;
  }
  for (const rule of workflows.get(wf).rules) {
    const [letter, operation, operand, result] = rule;
    const nr = newRanges(
      letter,
      operation,
      operand,
      xl,
      xh,
      ml,
      mh,
      al,
      ah,
      sl,
      sh
    );

    stack.push([result, ...nr]);

    [xl, xh, ml, mh, al, ah, sl, sh] = newRanges(
      letter,
      signMapping[operation],
      operand,
      xl,
      xh,
      ml,
      mh,
      al,
      ah,
      sl,
      sh
    );
  }
  stack.push([workflows.get(wf).default, xl, xh, ml, mh, al, ah, sl, sh]);
}

console.log("Part 2:", ans);
