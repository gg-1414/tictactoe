import inquirer from "inquirer";

async function runTicTacToe() {
  const WIN_CONDITIONS = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // last row
    [0, 3, 6], // left col
    [1, 4, 7], // middle col
    [2, 5, 8], // right col
    [0, 4, 8], // diagonal top left to bottom right
    [2, 4, 6], // diagonal top right to bottom left
  ];

  const BOARD_MAPPINGS = {
    0: "Row 0, Col 0",
    1: "Row 0, Col 1",
    2: "Row 0, Col 2",
    3: "Row 1, Col 0",
    4: "Row 1, Col 1",
    5: "Row 1, Col 2",
    6: "Row 2, Col 0",
    7: "Row 2, Col 1",
    8: "Row 2, Col 2",
  };

  const REVERSE_MAPPINGS = Object.fromEntries(
    Object.entries(BOARD_MAPPINGS).map(([k, v]) => [v, k])
  );

  // 1D array indicates positions on the tictactoe board (see mappings above)
  let board = new Array(9).fill("");

  let player = "O"; // or 'X'
  let winner = null;

  function generateChoices() {
    let choices = [];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        choices.push(BOARD_MAPPINGS[i]);
      }
    }
    return choices;
  }

  function updateBoard(userSelection) {
    board[REVERSE_MAPPINGS[userSelection]] = player;
  }

  function isTie() {
    return board.every((spot) => spot !== "");
  }

  function isWinner() {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [a, b, c] = WIN_CONDITIONS[i];
      if (board[a] === player && board[b] === player && board[c] === player) {
        return true;
      }
    }
    return false;
  }

  function displayBoard() {
    const row1 = `${board[0] || " "} | ${board[1] || " "} | ${board[2] || " "}`;
    const row2 = `${board[3] || " "} | ${board[4] || " "} | ${board[5] || " "}`;
    const row3 = `${board[6] || " "} | ${board[7] || " "} | ${board[8] || " "}`;
    const separator = "---------";

    const grid = `${row1}\n${separator}\n${row2}\n${separator}\n${row3}`;
    console.log(grid);
  }

  async function promptUser() {
    const { userSelection } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "userSelection",
        message: `Player ${player} what's your move?`,
        choices: generateChoices(),
      },
    ]);
    return userSelection;
  }

  async function play() {
    displayBoard();

    const userSelection = await promptUser();

    updateBoard(userSelection);

    if (isTie()) {
      displayBoard();
      console.log("It's a tie!");
      winner = "tie";
    } else if (isWinner()) {
      displayBoard();
      console.log(`Player ${player} wins!`);
      winner = player;
    } else {
      player = player === "O" ? "X" : "O";
    }
  }

  while (!winner) {
    await play();
  }
}

runTicTacToe();
