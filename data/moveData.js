export const directionMap = [
  {check: v => v.vx > 0, dir: 0},
  {check: v => v.vy < 0, dir: 1},
  {check: v => v.vx < 0, dir: 2},
  {check: v => v.vy > 0, dir: 3},
];

export const vectorMap = [
    [ 1, 0],
    [ 0,-1],
    [-1, 0],
    [ 0, 1]
];

export var moveInputs = [];