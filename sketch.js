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
// may 26th, problem solving when using a bigger grid
// May 28th, found the error that is caused when the grid is expanded. going through different intro screens
// May 30th, trying to read through an intro screen code and implement it 

const GRID_DIMENSIONS = 6;
let cellSize;
let mainGrid = [];
let xOffset, yOffset;
let dragPath = [];
let dragColor = null;
let isDragging = false;

let dots = ["red", "green", "blue", "yellow", "orange", "white", "purple"];
let completedPaths = []; // Stores valid finished paths

let whatPhase = "starting phase";

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  initialGrid();
}

function draw() {
  // for now im gonna switch in here because the starting screen is not done yet
  if (whatPhase === "starting phase"){ 
    background(20, 50, 100);
    drawGrid();
    drawDots();
    drawCompletedPaths();
    drawDragPath();
  }
  else if (whatPhase === "connect phase"){
    startScreen();
  }

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
    mainGrid[i][0] = mainGrid[i][GRID_DIMENSIONS-1] = dots[i];
    
  }

}

function drawGrid() {
  rectMode(CORNER);
  stroke(255);
  strokeWeight(1);
  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      fill("black");
      rect(xOffset + col * cellSize, yOffset + row * cellSize, cellSize, cellSize);
    }
  }
}

function drawDots() {
  for (let row = 0; row < GRID_DIMENSIONS; row++) {
    for (let col = 0; col < GRID_DIMENSIONS; col++) {
      const dotColor = mainGrid[row][col];
      if (dotColor) {
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

function mousePressed() {
  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const color = mainGrid[row][col];
  if (color) {
    isDragging = true;
    dragColor = color;
    dragPath = [{ row, col }];
  }
}

function mouseDragged() {
  if (!isDragging) {
    return;
  }

  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const last = dragPath[dragPath.length - 1];
  if (last.row === row && last.col === col) {
    return;
  }

  // Undo step if moving back
  if (
    dragPath.length > 1 &&
    dragPath[dragPath.length - 2].row === row &&
    dragPath[dragPath.length - 2].col === col
  ) {
    dragPath.pop();
    return;
  }

  if (
    (mainGrid[row][col] === null || mainGrid[row][col] === dragColor) &&
    !dragPath.some(p => p.row === row && p.col === col) &&
    cellsAreAdjacent(last.row, last.col, row, col)
  ) {
    const newSegA = cellToCenterXY(last);
    const newSegB = cellToCenterXY({ row, col });

    for (const pathObj of completedPaths) {
      const pts = pathObj.path;
      for (let i = 0; i < pts.length - 1; i++) {
        const segA = cellToCenterXY(pts[i]);
        const segB = cellToCenterXY(pts[i + 1]);
        if (collideLineLine(
          newSegA.x, newSegA.y,
          newSegB.x, newSegB.y,
          segA.x, segA.y,
          segB.x, segB.y
        )) {
          removePath(pathObj);
          // No resetDrag here, so new line stays
          return;
        }
      }
    }

    dragPath.push({ row, col });
  }
}


function mouseReleased() {
  // Pure click = delete endpoint
  if (dragPath.length === 1) {
    const { row, col } = dragPath[0];
    const color = mainGrid[row][col];
    for (let i = completedPaths.length - 1; i >= 0; i--) {
      const p = completedPaths[i];
      if (p.color === color) {
        const start = p.path[0];
        const end   = p.path[p.path.length - 1];
        if (start.row === row && start.col === col ||
            end  .row === row && end  .col === col) {
          removePath(p);
          break;
        }
      }
    }
    resetDrag();
    return;
  }

  // End of drag = validate
  if (dragPath.length >= 2) {
    const start = dragPath[0];
    const end   = dragPath[dragPath.length - 1];
    if (
      mainGrid[end.row][end.col] === dragColor &&
      (start.row !== end.row || start.col !== end.col)
    ) {
      completedPaths.push({ color: dragColor, path: [...dragPath] });
    }
  }

  resetDrag();
}

function getCellFromMouse() {
  const col = floor((mouseX - xOffset) / cellSize);
  const row = floor((mouseY - yOffset) / cellSize);
  return { row, col };
}

function isInsideGrid(row, col) {
  return row >= 0 && row < GRID_DIMENSIONS && col >= 0 && col < GRID_DIMENSIONS;
}

function cellsAreAdjacent(r1, c1, r2, c2) {
  return abs(r1 - r2) + abs(c1 - c2) === 1;
}

function resetDrag() {
  dragPath = [];
  dragColor = null;
  isDragging = false;
}

function drawDragPath() {
  if (!isDragging || dragPath.length < 2) {
    return;
  }
  stroke(dragColor);
  strokeWeight(20);
  noFill();
  beginShape();
  for (let pt of dragPath) {
    const { x, y } = cellToCenterXY(pt);
    vertex(x, y);
  }
  endShape();
}

function drawCompletedPaths() {
  for (let p of completedPaths) {
    stroke(p.color);
    strokeWeight(20);
    noFill();
    beginShape();
    for (let pt of p.path) {
      const { x, y } = cellToCenterXY(pt);
      vertex(x, y);
    }
    endShape();
  }
}

function cellToCenterXY(cell) {
  return {
    x: xOffset + cell.col * cellSize + cellSize / 2,
    y: yOffset + cell.row * cellSize + cellSize / 2
  };
}

function removePath(pathObj) {
  // clear intersecting cells
  for (let i = 1; i < pathObj.path.length - 1; i++) {
    const c = pathObj.path[i];
    mainGrid[c.row][c.col] = null;
  }
  const idx = completedPaths.indexOf(pathObj);
  if (idx !== -1) {
    completedPaths.splice(idx, 1);
  }
}

////////////////////////////////////////////////////////////////////////

