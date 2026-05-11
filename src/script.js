function createPlayer(name, mark) {
  return { name, mark };
}

const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const placeMark = (index, mark) => {
    if (board[index] === "") {
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
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");
  let currentPlayer = player1;
  let isGameOver = false;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
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

    if (checkWinner()) {
      console.log(`${currentPlayer.name} wins!`);
      isGameOver = true;
      DisplayController.updateStatus(`${currentPlayer.name} wins!`);
      return;
    }

    if (checkTie()) {
      console.log("It's a tie!");
      isGameOver = true;
      DisplayController.updateStatus("It's a tie!");
      return;
    }

    switchPlayer();
    DisplayController.updateStatus(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`,
    );
  };

  return { getCurrentPlayer, playRound };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");

  const renderBoard = () => {
    const board = Gameboard.getBoard();

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const addCellListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        GameController.playRound(index);
      });
    });
  };

  const statusText = document.querySelector(".status");

  const updateStatus = (message) => {
    statusText.textContent = message;
  };

  return {
    renderBoard,
    addCellListeners,
    updateStatus,
  };
})();

const checkWinner = (board) => {
  board = Gameboard.getBoard();

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

  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return board[index] === currentPlayer.mark;
    });
  });
};
