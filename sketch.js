// Multiplayer chess
// Ranu Jayawickrama
// April 17th

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// log
// April 17th - started researchng about p5.party to create multiplayer function of the game 
// APRIL 29TH - RESEARCHING ON CHESS BOTS 
// April 30th - Researchig about new mini games, planning to change in proposal.md
// May 1st - updating proposals.md 
// May 2nd - building up basic logic/procedure for Happy connect

// Happy connect procedure
// step 1 - create a square grid with pairs of dots with the same color placed in it
// step 2 - create a function to control the path of the dots with the mouse
// step 3 - create a function to display the path of the selcted dot
// step 4 - create a function to detect whether the connceted dots are the same color

const CHESSBOARD_DIMENSIONS = 8; // 8x8 chess board
let cellSize;                     
let board = [];                  
let xOffset, yOffset;// offsets for centering the board

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateBoardDimensions(); // Calculate initial board dimensions
  initialBoard(); // Set up starting piece positions
}

function draw() {
  background("cyan");

  drawBoard();
  drawPieces();
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

  // Set up pawns
  for (let i = 0; i < CHESSBOARD_DIMENSIONS; i++) {
    board[1][i] = { type: "pawn", color: "black" }; // Black pawns
    board[6][i] = { type: "pawn", color: "white" }; // White pawns
  }

  // Set up other pieces
  const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  
  // Black back row
  PIECE_ORDER.forEach((type, col) => {
    board[0][col] = { type, color: "black" };
  });
  
  // White back row
  PIECE_ORDER.forEach((type, col) => {
    board[7][col] = { type, color: "white" };
  });
}


function drawBoard() {
  rectMode(CORNER); // Draw from top-left corner
  stroke(0);//boarders for the chess squares
  strokeWeight(1);
  
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      fill((row + col) % 2 === 0 ? 240 : "lightgreen");// draw white and black squares alternately
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);//offset used to center the chess board
    }
  }
}