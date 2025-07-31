// Game variables
let gameMode = null;
let turn0 = true; // true = O's turn, false = X's turn
let isGameOver = false;
let mode = "light";

// DOM elements
const cells = document.querySelectorAll(".cell");
const resetBtn = document.querySelector("#reset");
const darkBtn = document.querySelector("#mode");
const modeText = document.querySelector("#mode-text");
const container = document.querySelector('.game-container');
const heading = document.querySelectorAll('h2');
const statusDisplay = document.querySelector('#status');
const twoPlayerBtn = document.querySelector('#twoPlayer');
const vsComputerBtn = document.querySelector('#vsComputer');

// Win patterns
const winPattern = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

// Dark/Light mode toggle
darkBtn.addEventListener("click", () => {
  if (mode === "light") {
    mode = "dark";
    container.classList.add('dark-mode');
    modeText.textContent = "🌙 Dark";
    document.body.style.color = "white";
  } else {
    mode = "light";
    container.classList.remove('dark-mode');
    modeText.textContent = "🌞 Light";
    document.body.style.color = "black";
  }
});

// Game mode selection
twoPlayerBtn.addEventListener("click", () => {
  gameMode = "two";
  twoPlayerBtn.classList.add('active');
  vsComputerBtn.classList.remove('active');
  resetBoard();
  updateStatus("Player O's turn");
});

vsComputerBtn.addEventListener("click", () => {
  gameMode = "computer";
  vsComputerBtn.classList.add('active');
  twoPlayerBtn.classList.remove('active');
  resetBoard();
  updateStatus("Your turn (O)");
});

// Cell click handler
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("disabled") || isGameOver || !gameMode) return;

    if (gameMode === "two") {
      // Two player mode
      cell.innerText = turn0 ? "O" : "X";
      cell.classList.add("disabled");

      if (!checkWinner()) {
        turn0 = !turn0;
        updateStatus(`Player ${turn0 ? "O" : "X"}'s turn`);

        // Check for draw
        if (isDraw()) {
          updateStatus("It's a Draw! 🤝");
          isGameOver = true;
        }
      }
    } else if (gameMode === "computer" && turn0) {
      // Computer mode - player's turn
      cell.innerText = "O";
      cell.classList.add("disabled");

      if (!checkWinner() && !isDraw()) {
        turn0 = false;
        updateStatus("Computer is thinking... 🤔", "computer-thinking");

        // Computer move after delay
        setTimeout(() => {
          computerMove();
        }, 1000);
      }
    }
  });
});

// Computer move logic
function computerMove() {
  if (isGameOver) return;

  // Try to win first
  let move = findWinningMove("X");

  // If can't win, try to block player
  if (move === -1) {
    move = findWinningMove("O");
  }

  // If no strategic move, pick random
  if (move === -1) {
    const availableCells = Array.from(cells)
      .map((cell, index) => !cell.classList.contains("disabled") ? index : -1)
      .filter(index => index !== -1);

    if (availableCells.length > 0) {
      move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }
  }

  if (move !== -1) {
    cells[move].innerText = "X";
    cells[move].classList.add("disabled");

    if (!checkWinner() && !isDraw()) {
      turn0 = true;
      updateStatus("Your turn (O)");
    }
  }
}

// Find winning move for a player
function findWinningMove(player) {
  for (let pattern of winPattern) {
    const [a, b, c] = pattern;
    const cellA = cells[a].innerText;
    const cellB = cells[b].innerText;
    const cellC = cells[c].innerText;

    // Check if two cells have the player's mark and one is empty
    if (cellA === player && cellB === player && cellC === "") return c;
    if (cellA === player && cellC === player && cellB === "") return b;
    if (cellB === player && cellC === player && cellA === "") return a;
  }
  return -1;
}

// Check for winner
function checkWinner() {
  for (let pattern of winPattern) {
    const [a, b, c] = pattern;
    const cellA = cells[a].innerText;
    const cellB = cells[b].innerText;
    const cellC = cells[c].innerText;

    if (cellA !== "" && cellA === cellB && cellB === cellC) {
      highlightWinner(pattern);
      const winner = cellA;

      if (gameMode === "computer") {
        updateStatus(winner === "O" ? "You Win! 🎉" : "Computer Wins! 🤖", "winner-animation");
      } else {
        updateStatus(`Player ${winner} Wins! 🎉`, "winner-animation");
      }

      isGameOver = true;
      return true;
    }
  }
  return false;
}

// Check for draw
function isDraw() {
  return Array.from(cells).every(cell => cell.classList.contains("disabled"));
}

// Highlight winning cells
function highlightWinner(pattern) {
  pattern.forEach(index => {
    cells[index].style.backgroundColor = "limegreen";
    cells[index].style.color = "white";
    cells[index].style.transform = "scale(1.1)";
  });
}

// Update status display
function updateStatus(message, className = "") {
  statusDisplay.innerHTML = `<p class="status-text ${className}">${message}</p>`;
}

// Reset board
function resetBoard() {
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("disabled");
    cell.style.backgroundColor = "";
    cell.style.color = "";
    cell.style.transform = "";
  });

  turn0 = true;
  isGameOver = false;

  if (gameMode === "two") {
    updateStatus("Player O's turn");
  } else if (gameMode === "computer") {
    updateStatus("Your turn (O)");
  } else {
    updateStatus("Select a game mode to start!");
  }
}

// Reset button
resetBtn.addEventListener("click", resetBoard);

// Initialize
updateStatus("Select a game mode to start!");