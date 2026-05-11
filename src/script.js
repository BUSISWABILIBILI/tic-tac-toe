function createPlayer(name, mark, type = "human") {
  return { name, mark, type };
}

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

  return { getBoard, placeMark, resetBoard };
})();

const GameController = (() => {
  let player1 = createPlayer("Player 1", "X");
  let player2 = createPlayer("Player 2", "O");

  let currentPlayer = player1;
  let isGameOver = false;
  let isComputerThinking = false;

  let player1Score = 0;
  let player2Score = 0;

  const getCurrentPlayer = () => currentPlayer;
  const getIsGameOver = () => isGameOver;
  const getIsComputerThinking = () => isComputerThinking;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const findWinner = (board, mark) => {
    return winningCombinations.find((combination) => {
      return combination.every((index) => board[index] === mark);
    });
  };

  const checkTie = (board) => {
    return board.every((cell) => cell !== "");
  };

  const updateTurnStatus = () => {
    DisplayController.updateStatus(
      `${currentPlayer.name}'s turn (${currentPlayer.mark})`,
    );
  };

  const finishRound = (winningCombination) => {
    isGameOver = true;
    isComputerThinking = false;

    if (currentPlayer === player1) {
      player1Score++;
    } else {
      player2Score++;
    }

    DisplayController.updateScores(
      player1.name,
      player1Score,
      player2.name,
      player2Score,
    );
    DisplayController.renderBoard();
    DisplayController.highlightWinningCells(winningCombination);
    DisplayController.updateStatus(`${currentPlayer.name} wins!`);
  };

  const minimax = (board, depth, isMaximizing) => {
    if (findWinner(board, player2.mark)) return 10 - depth;
    if (findWinner(board, player1.mark)) return depth - 10;
    if (checkTie(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;

      board.forEach((cell, index) => {
        if (cell === "") {
          board[index] = player2.mark;
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[index] = "";
        }
      });

      return bestScore;
    }

    let bestScore = Infinity;

    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = player1.mark;
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[index] = "";
      }
    });

    return bestScore;
  };

  const getBestComputerMove = () => {
    const board = [...Gameboard.getBoard()];
    let bestScore = -Infinity;
    let move = null;

    board.forEach((cell, index) => {
      if (cell === "") {
        board[index] = player2.mark;
        const score = minimax(board, 0, false);
        board[index] = "";

        if (score > bestScore) {
          bestScore = score;
          move = index;
        }
      }
    });

    return move;
  };

  const scheduleComputerMove = () => {
    if (currentPlayer.type !== "computer" || isGameOver) return;

    isComputerThinking = true;
    DisplayController.updateStatus(`${currentPlayer.name} is thinking...`);
    DisplayController.renderBoard();

    window.setTimeout(() => {
      const move = getBestComputerMove();
      isComputerThinking = false;

      if (move !== null) {
        playRound(move);
      }
    }, 350);
  };

  const playRound = (index) => {
    if (isGameOver || isComputerThinking) return;

    const markPlaced = Gameboard.placeMark(Number(index), currentPlayer.mark);

    if (!markPlaced) {
      DisplayController.updateStatus("Cell already occupied. Pick another one.");
      return;
    }

    DisplayController.renderBoard();

    const winningCombination = findWinner(
      Gameboard.getBoard(),
      currentPlayer.mark,
    );

    if (winningCombination) {
      finishRound(winningCombination);
      return;
    }

    if (checkTie(Gameboard.getBoard())) {
      isGameOver = true;
      DisplayController.updateStatus("It's a tie!");
      DisplayController.renderBoard();
      return;
    }

    switchPlayer();
    updateTurnStatus();
    scheduleComputerMove();
  };

  const restartGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    isGameOver = false;
    isComputerThinking = false;

    DisplayController.renderBoard();
    updateTurnStatus();
  };

  const resetScores = () => {
    player1Score = 0;
    player2Score = 0;
    DisplayController.updateScores(
      player1.name,
      player1Score,
      player2.name,
      player2Score,
    );
    restartGame();
  };

  const startGame = (playerOneName, playerTwoName, mode) => {
    const cleanPlayerOneName = playerOneName.trim() || "Player 1";
    const cleanPlayerTwoName =
      mode === "computer" ? "Computer" : playerTwoName.trim() || "Player 2";

    player1 = createPlayer(cleanPlayerOneName, "X");
    player2 = createPlayer(
      cleanPlayerTwoName,
      "O",
      mode === "computer" ? "computer" : "human",
    );

    player1Score = 0;
    player2Score = 0;
    currentPlayer = player1;
    isGameOver = false;
    isComputerThinking = false;

    DisplayController.updateScores(
      player1.name,
      player1Score,
      player2.name,
      player2Score,
    );

    Gameboard.resetBoard();
    DisplayController.renderBoard();
    updateTurnStatus();
  };

  return {
    getCurrentPlayer,
    getIsGameOver,
    getIsComputerThinking,
    playRound,
    restartGame,
    resetScores,
    startGame,
  };
})();

const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const statusText = document.querySelector(".status");
  const restartButton = document.querySelector(".restart-btn");
  const resetScoreButton = document.querySelector(".reset-score-btn");
  const startButton = document.querySelector(".start-btn");
  const playerOneInput = document.querySelector("#player-one-name");
  const playerTwoInput = document.querySelector("#player-two-name");
  const gameModeSelect = document.querySelector("#game-mode");
  const playerOneScoreText = document.querySelector(".player-one-score");
  const playerTwoScoreText = document.querySelector(".player-two-score");

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    const isBoardLocked =
      GameController.getIsGameOver() || GameController.getIsComputerThinking();

    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.classList.remove("winner", "x", "o");
      cell.disabled = isBoardLocked || board[index] !== "";
      cell.setAttribute("aria-label", `Cell ${index + 1}`);

      if (board[index]) {
        cell.classList.add(board[index].toLowerCase());
        cell.setAttribute("aria-label", `Cell ${index + 1}: ${board[index]}`);
      }
    });
  };

  const startCurrentGame = () => {
    GameController.startGame(
      playerOneInput.value,
      playerTwoInput.value,
      gameModeSelect.value,
    );
  };

  const syncModeFields = () => {
    const isComputerMode = gameModeSelect.value === "computer";
    playerTwoInput.disabled = isComputerMode;
    playerTwoInput.placeholder = isComputerMode
      ? "Computer"
      : "Player 2 name";

    if (isComputerMode) {
      playerTwoInput.value = "";
    }
  };

  const addCellListeners = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        GameController.playRound(cell.dataset.index);
      });
    });

    restartButton.addEventListener("click", () => {
      GameController.restartGame();
    });

    resetScoreButton.addEventListener("click", () => {
      GameController.resetScores();
    });

    startButton.addEventListener("click", startCurrentGame);

    [playerOneInput, playerTwoInput].forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          startCurrentGame();
        }
      });
    });

    gameModeSelect.addEventListener("change", () => {
      syncModeFields();
      startCurrentGame();
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

  const updateScores = (
    playerOneName,
    playerOneScore,
    playerTwoName,
    playerTwoScore,
  ) => {
    playerOneScoreText.textContent = `${playerOneName}: ${playerOneScore}`;
    playerTwoScoreText.textContent = `${playerTwoName}: ${playerTwoScore}`;
  };

  syncModeFields();

  return {
    renderBoard,
    addCellListeners,
    updateStatus,
    highlightWinningCells,
    updateScores,
  };
})();

DisplayController.addCellListeners();
DisplayController.renderBoard();
