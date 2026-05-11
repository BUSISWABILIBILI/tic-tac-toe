function createPlayer(name, mark) {
  return { name, mark };
}

const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMark = (index, mark) => {
    if (board[index] !== "") {
      return false;
    }

    board[index] = mark;
    return true;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  const printBoard = () => {
    console.log(board);
  };

  return { getBoard, placeMark, resetBoard, printBoard };
})();

const GameController = (() => {
  let player1 = createPlayer("Player 1", "X");
  let player2 = createPlayer("Player 2", "O");

  let currentPlayer = player1;
  let isGameOver = false;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();

    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.find((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer.mark;
      });
    });
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  const playRound = (index) => {
    if (isGameOver) return;

    const markPlaced = Gameboard.placeMark(index, currentPlayer.mark);

    if (!markPlaced) {
      DisplayController.updateStatus("Cell already occupied! Try again.");
      return;
    }

    Gameboard.printBoard();
    DisplayController.renderBoard();

    const winningCombination = checkWinner();

    if (winningCombination) {
      isGameOver = true;
      DisplayController.highlightWinningCells(winningCombination);
      DisplayController.updateStatus(`${currentPlayer.name} wins!`);
      return;
    }

    if (checkTie()) {
      isGameOver = true;
      DisplayController.updateStatus("It's a tie!");
      return;
    }

    switchPlayer();

    DisplayController.updateStatus(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`,
    );
  };

  const restartGame = () => {
    Gameboard.resetBoard();

    currentPlayer = player1;
    isGameOver = false;

    DisplayController.renderBoard();

    DisplayController.updateStatus(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`,
    );
  };

  const startGame = (playerOneName, playerTwoName) => {
    player1 = createPlayer(playerOneName || "Player 1", "X");
    player2 = createPlayer(playerTwoName || "Player 2", "O");

    currentPlayer = player1;
    isGameOver = false;

    Gameboard.resetBoard();
    DisplayController.renderBoard();

    DisplayController.updateStatus(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`,
    );
  };

  return { getCurrentPlayer, playRound, restartGame, startGame };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector(".status");
  const restartButton = document.querySelector(".restart-btn");
  const startButton = document.querySelector(".start-btn");
  const playerOneInput = document.querySelector("#player-one-name");
  const playerTwoInput = document.querySelector("#player-two-name");

  const renderBoard = () => {
    const board = Gameboard.getBoard();

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.classList.remove("winner");
    });
  };

  const addCellListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        GameController.playRound(index);
      });
    });

    restartButton.addEventListener("click", () => {
      GameController.restartGame();
    });

    startButton.addEventListener("click", () => {
      GameController.startGame(playerOneInput.value, playerTwoInput.value);
    });
  };

  const updateStatus = (message) => {
    statusText.textContent = message;
  };

  const highlightWinningCells = (winningCombination) => {
    winningCombination.forEach((index) => {
      cells[index].classList.add("winner");
    });
  };

  return {
    renderBoard,
    addCellListeners,
    updateStatus,
    highlightWinningCells,
  };
})();

DisplayController.addCellListeners();
