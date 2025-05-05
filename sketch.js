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

const CHESSBOARD_DIMENSIONS =3; // 8x8 chess board
let cellSize;                     
let board = [];                  
let xOffset, yOffset;// offsets for centering the board

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateBoardDimensions(); // Calculate initial board dimensions
  //initialBoard(); // Set up starting piece positions
}

function draw() {
  background(20, 50, 100);

  drawBoard();
  drawPieces();
}

// function initialBoard() {

// }
function calculateBoardDimensions() {
  // Size board based on smaller size
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / CHESSBOARD_DIMENSIONS * 0.9; // 90% of available space
  
  // Center the board
  xOffset = (width - cellSize * CHESSBOARD_DIMENSIONS) / 2;
  yOffset = (height - cellSize * CHESSBOARD_DIMENSIONS) / 2;
}

function drawBoard() {
  rectMode(CORNER); // Draw from top-left corner
  stroke(0);//boarders for the chess squares
  strokeWeight(1);
  
  for (let row = 0; row < CHESSBOARD_DIMENSIONS; row++) {
    for (let col = 0; col < CHESSBOARD_DIMENSIONS; col++) {
      
      stroke("white");
      fill("black");// draw white and black squares alternately
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);//offset used to center the chess board
    }
  }
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



//////////////////////////////////////////////////////////////////////

// 2D Array Grid Neighbours Demo

let cellSize;
const SQUARE_DIMENSIONS = 10;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);

  //make the largest square that fits
  if (height > width) {
    cellSize = width / SQUARE_DIMENSIONS;
  }
  else {
    cellSize = height / SQUARE_DIMENSIONS;
  }

  grid = generateGrid(SQUARE_DIMENSIONS, SQUARE_DIMENSIONS);
}

function draw() {
  background(220);
  displayGrid();
}


function displayGrid() {
  for (let y = 0; y < SQUARE_DIMENSIONS; y++) {
    for (let x = 0; x < SQUARE_DIMENSIONS; x++) {
      if (grid[y][x] === 1) {
        fill("black");
      }
      else if (grid[y][x] === 0) {
        fill("white");
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
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

// function generateRandomGrid(cols, rows) {
//   let newGrid = [];
//   for (let y = 0; y < rows; y++) {
//     newGrid.push([]);
//     for (let x = 0; x < cols; x++) {
//       if (random(100) < 50) {
//         newGrid[y].push(0);
//       }
//       else {
//         newGrid[y].push(1);
//       }
//     }
//   }
//   return newGrid;
// }

