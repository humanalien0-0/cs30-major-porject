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

const GRID_DIMENSIONS = 3;
let cellSize;                     
let mainGrid = [];                  
let xOffset, yOffset;

let dots = ["red", "green", "blue"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  initialGrid();
}

function draw() {
  background(20, 50, 100);
  drawGrid();
  drawDots();
}

function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / GRID_DIMENSIONS * 0.9;
  xOffset = (width - cellSize * GRID_DIMENSIONS) / 2;
  yOffset = (height - cellSize * GRID_DIMENSIONS) / 2;
}

function initialGrid() {
  for (let y = 0; y < GRID_DIMENSIONS; y++) {
    let row = [];
    for (let x = 0; x < GRID_DIMENSIONS; x++) {
      row.push(null);
    }
    mainGrid.push(row);
  }

  for (let i = 0; i < GRID_DIMENSIONS; i++) {
    mainGrid[i][0] = mainGrid[i][2] = dots[i];
  }
}

function drawGrid() {
  rectMode(CORNER);
  stroke(255);  
  strokeWeight(1);

  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      fill("black");   // make all squares black
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);
    }
  }
}

function drawDots() {
  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      const dotColor = mainGrid[row][col];// get the colour of the dot
      if (dotColor) {  // if there is a dot dot of any colour passed in...
        const x = xOffset + col * cellSize;
        const y = yOffset + row * cellSize;
        displayDots(dotColor, x, y);
      }
    }
  }
}

function displayDots(color, x, y) {
  const SIZE = cellSize * 0.4;
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;
  fill(color);
  noStroke();
  circle(centerX, centerY, SIZE);
}
