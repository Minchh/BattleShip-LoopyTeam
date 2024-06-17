// return an NxN board initialized with 0s
function emptyBoard(N = 10) {
  return new Array(N).fill(0).map(() => new Array(N).fill(0));
}

// places integer value of ship horizontally/vertically on board starting at (x, y)
// return true if successfully placed, false otherwise (no change to board if false)
function placeShip(board, ship, i0, j0, horizontal = true) {
  let length = SIZES[ship];
  let i = i0;
  let j = j0;

  if (horizontal) {
    // check bounds
    if (j0 + length > board[0].length) return false;
    // check space not occupied
    for (j = j0; j < j0 + length; j++) {
      if (board[i][j] != 0) return false;
    }
    // place ship
    for (j = j0; j < j0 + length; j++) {
      board[i][j] = ship;
    }
  } else {
    // check bounds
    if (i0 + length > board.length) return false;
    // check space not occupied
    for (i = i0; i < i0 + length; i++) {
      if (board[i][j] != 0) return false;
    }
    // place ship
    for (i = i0; i < i0 + length; i++) {
      board[i][j] = ship;
    }
  }
  return true;
}

// create and return a randomly initialized game board
function randomBoard() {
  const N = 10;
  let board = emptyBoard(N);
  for (let ship of SHIPS) {
    let placed = false;
    // find valid random location for each ship
    while (!placed) {
      let i0 = Math.floor(Math.random() * 10);
      let j0 = Math.floor(Math.random() * 10);
      let horizontal = Math.random() > 0.5;
      placed = placeShip(board, ship, i0, j0, horizontal);
    }
  }
  return board;
}

// return a map of hit/miss/ship to matching cells
function getBoardState(elementId, board) {
  let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  let id = elementId[0];
  let coordMap = {};
  coordMap[HIT] = [];
  coordMap[MISS] = [];
  coordMap[EMPTY] = [];
  for (let ship of SHIPS) {
    coordMap[ship] = [];
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      let cell = board[i][j];
      coordMap[cell].push(`${id}${rows[i]}${j}`);
    }
  }
  return coordMap;
}
