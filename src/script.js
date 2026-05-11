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

function createPlayer(name, mark) {
  return { name, mark };
}

const playerOne = createPlayer("Player One", "X");
const playerTwo = createPlayer("Player Two", "O");

console.log(playerOne);
console.log(playerTwo);
