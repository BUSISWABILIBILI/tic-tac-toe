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

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (index) => {
    const markPlaced = Gameboard.placeMark(index, currentPlayer.mark);

    if (!markPlaced) {
      console.log("The spot is already taken.");
      return;
    }

    Gameboard.printBoard();

    if (checkWinner()) {
      console.log(`${currentPlayer.name} wins!`);
      return;
    }

    switchPlayer();
  };

  return { getCurrentPlayer, playRound };
})();

const checkWinner = (board) => {
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

  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return board[index] === currentPlayer.marker;
    });
  });
};
