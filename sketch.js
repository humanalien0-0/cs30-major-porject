// Multiplayer chess
// Ranu Jayawickrama
// April 17th

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Happy connect procedure
// step 1 - create a square grid with pairs of dots with the same color placed in it
// step 2 - create a function to control the path of the dots with the mouse
// step 3 - create a function to display the path of the selcted dot
// step 4 - create a function to detect whether the connceted dots are the same color

// log
// may 7th - researching about animations
// may 9th - deep research about text files
// May 12th, research about game rules.
// May 13th, trying to implement 2D collision detection 
// May 20th, succeeded in displaying the dots

const CHESSBOARD_DIMENSIONS =3; // 8x8 chess board
let cellSize;                     
let board = [];                  
let xOffset, yOffset;// offsets for centering the board

let dots = ["r", "g", "b"];


function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateBoardDimensions(); // Calculate initial board dimensions
  initialBoard(); // Set up starting piece positions
}

function draw() {
  background(20, 50, 100);
  drawBoard();
  drawPieces();
}

function calculateBoardDimensions() {
  // Size board based on smaller size
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / CHESSBOARD_DIMENSIONS * 0.9; // 90% of available space
  
  // Center the board
  xOffset = (width - cellSize * CHESSBOARD_DIMENSIONS) / 2;
  yOffset = (height - cellSize * CHESSBOARD_DIMENSIONS) / 2;
}


function initialBoard() {
  // draw empty chess board
  board = [];
  for (let y = 0; y < CHESSBOARD_DIMENSIONS; y++) {
    let row = [];
    for (let x = 0; x < CHESSBOARD_DIMENSIONS; x++) {
      row.push(null);
    }
    board.push(row);
  }

  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[i][0] = board[i][2] = dots[i];
  }
  console.log(board[0][1]);

}

function drawBoard() {
  rectMode(CORNER); // Draw from top-left corner
  stroke(0);//boarders for the chess squares
  strokeWeight(1);
  
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      
      stroke("white");
      fill("black");// draw white and black squares alternately
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize);//offset used to center the chess board
    }
  }
}

function generateGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function drawPieces() {
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      const PIECE = board[row][col];
      if (PIECE) {
        const X_COR = xOffset + col * cellSize;
        const Y_COR = yOffset + row * cellSize;
        displayPiece(PIECE, X_COR, Y_COR);
      }
    }
  }
}

// Draws an individual piece and increases the size of a piece when selected
function displayPiece(x, y) {
  const IMG_SIZE = cellSize * 0.4;
  const CENTER_PIECE_X = x + cellSize / 2 - IMG_SIZE / 2;
  const CENTER_PIECE_Y = y + cellSize / 2 - IMG_SIZE / 2;
  circle (CENTER_PIECE_X, CENTER_PIECE_Y, IMG_SIZE);
}

// function displayPiece(piece, x, y, row, col) {
//   const IMG = piece.color === "white" ? whitePieces[piece.type] : blackPieces[piece.type];
  
//   // setting up constants to change the size of the piece if selected 
//   const IS_SELECTED = selectedPiece && selectedRow === row && selectedCol === col;
//   const SCALE_OF_PIECES = IS_SELECTED ? selectedPieceScale : defaultPieceScale;
//   const IMG_SIZE = cellSize * SCALE_OF_PIECES;
  
//   // setting up constants to center the piece in its square
//   const CENTER_PIECE_X = x + cellSize / 2 - IMG_SIZE / 2;
//   const CENTER_PIECE_Y = y + cellSize / 2 - IMG_SIZE / 2;
//   image(IMG, CENTER_PIECE_X, CENTER_PIECE_Y, IMG_SIZE, IMG_SIZE);// center and scale piece
// }
