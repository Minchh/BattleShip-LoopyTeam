// game settings
var settings = {
  playerBoard: null,
  difficulty: null,
};
var game = null;

// sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// resets panel and footer for new game
function resetPanelFooter() {
  for (let id of ["player-footer", "ai-footer"]) {
    let elem = document.getElementById(id);
    if (!elem.classList.contains("hidden")) {
      elem.classList.add("hidden");
    }
  }

  for (let id of ["player-panel", "ai-panel"]) {
    let divs = document.querySelectorAll(`#${id} div`);
    for (let div of divs) {
      div.style.color = "";
    }
  }
}

// disables or enables buttons
function toggleButtons(disabled = true) {
  let buttonIds = [
    "start-btn",
    "mode-easy-btn",
    "mode-medium-btn",
    "mode-hard-btn",
    "place-randomly-button",
  ];
  for (let id of buttonIds) {
    document.getElementById(id).disabled = disabled;
  }
}

// handles player clicking randomize button
function handleRandomizeClick() {
  settings.playerBoard = randomBoard();
  let state = getBoardState("playerBoard", settings.playerBoard);
  // unhide player elements and render
  // document.getElementById("playerboard").classList.remove("hidden");
  // document.getElementById('player-footer').classList.remove("hidden");
  render(state, true, true);
  render(getBoardState("enemyBoard", emptyBoard()), true, true);

  if (settings.playerBoard != null && settings.difficulty != null) {
    document.getElementById("start-btn").classList.remove("hidden");
  }
}

// handles player clicking (esay/medium/hard) buttons
function handleDifficultyClick(selectedID) {
  for (let id of ["mode-easy-btn", "mode-medium-btn", "mode-hard-btn"]) {
    let button = document.getElementById(id);
    if (id === selectedID) {
      let difficulty = id.split("-")[1];
      settings.difficulty = difficulty;
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  }

  if (settings.playerBoard != null && settings.difficulty != null) {
    document.getElementById("start-btn").classList.remove("hidden");
  }
}

// handles player clicking start button
function handleStartClick() {
  // disables all the buttons
  toggleButtons(true);
  // reset panel/footer
  resetPanelFooter();

  document.getElementById("player-place-panel").classList.add("hidden");
  for (let id of ["player-panel", "ai-panel"]) {
    document.getElementById(id).classList.remove("hidden");
  }

  game = new Game(settings.difficulty, settings.playerBoard);
  game.start();
}

// handle player cell selection on enemy board
function handleBoardClick(id) {
  if (game === null) {
    alert("Please select start the game first!");
  } else game.playerSelect = id.substring(1);
}

// display when a ship has sunk
function displaySink(owner, shipId) {
  if (owner === "player" || owner === "ai") {
    document.getElementById(`${owner}-ship-label-${shipId}`).style.color =
      "white";
    document.getElementById(`${owner}-ship-count-${shipId}`).style.color =
      "white";
  } else {
    console.log("Warning: Invalid sink: " + owner);
  }
}

function initBoards() {
  let boardIDs = ["playerBoard", "enemyBoard"];
  let rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  // init gap spaces
  for (let boardID of boardIDs) {
    let board = document.getElementById(boardID);
    let id = boardID[0];
    for (let row of rows) {
      for (let col = 0; col < 10; col++) {
        let div = document.createElement("div");
        div.id = `${id}${row}${col}`;
        div.className = "opaque";
        if (boardID === "enemyBoard") {
          div.onclick = () => handleBoardClick(div.id);
        }
        board.appendChild(div);
      }
    }
  }
}

// render a map of cell states onto the document */
function render(coordMap, renderShips = true, opaque = false) {
  for (let state of Object.keys(coordMap)) {
    let opacity = opaque ? "opaque " : "";
    for (let cellId of coordMap[state]) {
      let div = document.getElementById(cellId);

      if (state == EMPTY) {
        div.className = opacity;
      } else if (state == HIT) {
        div.className = opacity + "hit";
      } else if (state == MISS) {
        div.className = opacity + "miss";
      } else if (renderShips) {
        div.className = opacity + "ship";
      } else {
        div.className = opacity;
      }
    }
  }
}

// Display the game winner */
function displayWinner(winner, loser) {
  winnerElem = document
    .getElementById(`${winner}-footer`)
    .classList.remove("hidden");
}

// Start page
initBoards();

for (let id of ["mode-easy-btn", "mode-medium-btn", "mode-hard-btn"]) {
  document.getElementById(id).onclick = () => handleDifficultyClick(id);
}
document.getElementById("place-randomly-button").onclick = () =>
  handleRandomizeClick();
document.getElementById("start-btn").onclick = () => handleStartClick();
