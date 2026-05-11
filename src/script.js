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
    switchPlayer();
  };

  return { getCurrentPlayer, playRound };
})();
