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
    Object.entries(BOARD_MAPPINGS).map(([k, v]) => [v, k]),
  );

  // 1D array indicates positions on the tictactoe board (see mappings above)
  let board = new Array(9).fill("");

  let computer = "O";
  let player = "X";
  let currentTurn = computer;
  let winner = null;
  let difficulty = "easy"; // or 'normal' or 'hard

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
      if (
        board[a] === currentTurn &&
        board[b] === currentTurn &&
        board[c] === currentTurn
      ) {
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

    const grid = `${row1}\n${separator}\n${row2}\n${separator}\n${row3}\n\n`;
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

  function checkWinOrTie() {
    if (isWinner()) {
      console.log(`Player ${currentTurn} wins!`);
      winner = currentTurn;
      return true;
    } else if (isTie()) {
      console.log("It's a tie!");
      winner = "tie";
      return true;
    }
    currentTurn = currentTurn === computer ? player : computer;
    return false;
  }

  async function playComputer() {
    let availableSpots = [];
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        availableSpots.push(i);
      }
    }

    const randomIndex = Math.floor(Math.random() * availableSpots.length);
    const computerSelection = availableSpots[randomIndex];
    board[computerSelection] = computer;

    displayBoard();
    return checkWinOrTie();
  }

  async function play() {
    const endGame = await playComputer();

    if (!endGame) {
      const userSelection = await promptUser();
      updateBoard(userSelection);
      displayBoard();
      checkWinOrTie();
    }
  }

  while (!winner) {
    await play();
  }
}

runTicTacToe();
