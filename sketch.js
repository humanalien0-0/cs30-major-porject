// Dot link
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

let gridDimensions = 6;
let cellSize;
let mainGrid = [];
let xOffset, yOffset;
let dragPath = [];
let dragColor = null;
let isDragging = false;
let spacing = 30;    // spacing between animation rectangles
let scaleAnim = 0.15;  // scale factor for rectangle sizes
let cols, rows;
let sizeGrid = [];

let levelStartTime;
let levelTimeLimit = 5000; // 5 seconds in milliseconds
let timeRemaining = levelTimeLimit;

let dots = ["red", "green", "blue", "yellow", "orange", "white", "purple"];
let completedPaths = []; // Stores valid finished paths

let whatPhase = "starting phase";

let levels = [
  {
    gridSize: 3,
    dots: [
      {row: 0, col: 0, color: "red"}, {row: 0, col: 2, color: "red"},
      {row: 1, col: 0, color: "green"}, {row: 1, col: 2, color: "green"},
      {row: 2, col: 0, color: "blue"}, {row: 2, col: 2, color: "blue"}
    ],
    specialBlocks: []
  },
  {
    gridSize: 5,
    dots: [
      {row: 0, col: 1, color: "red"}, {row: 3, col: 0, color: "red"},
      {row: 0, col: 2, color: "green"}, {row: 3, col: 2, color: "green"},
      {row: 0, col: 3, color: "blue"}, {row: 4, col: 4, color: "blue"},
      {row: 1, col: 1, color: "yellow"}, {row: 4, col: 0, color: "yellow"},
      {row: 1, col: 3, color: "orange"}, {row: 4, col: 2, color: "orange"}
    ],
    specialBlocks: []
  },
  {
    gridSize: 5,
    dots: [
      {row: 0, col: 3, color: "red"}, {row: 3, col: 0, color: "red"},
      {row: 0, col: 4, color: "green"}, {row: 2, col: 2, color: "green"},
      {row: 1, col: 2, color: "blue"}, {row: 2, col: 1, color: "blue"},
      {row: 3, col: 1, color: "yellow"}, {row: 3, col: 3, color: "yellow"},
      {row: 4, col: 0, color: "orange"}, {row: 3, col: 4, color: "orange"}
    ],
    specialBlocks: [
      {row: 1, col: 3, type: "metalBlockade"}
    ]
  },
  {
    gridSize: 5,
    dots: [
      {row: 1, col: 0, color: "red"}, {row: 3, col: 4, color: "red"},
      {row: 0, col: 4, color: "blue"}, {row: 2, col: 4, color: "blue"},
      {row: 3, col: 0, color: "green"}, {row: 4, col: 3, color: "green"}
    ],
    specialBlocks: [
      {row: 0, col: 0, type: "metalBlockade"},
      {row: 2, col: 0, type: "metalBlockade"},
      {row: 4, col: 0, type: "metalBlockade"},
      {row: 4, col: 4, type: "metalBlockade"},
      {row: 4, col: 1, type: "metalBlockade"},
      {row: 4, col: 2, type: "metalBlockade"},
      {row: 1, col: 1, type: "xJunction"},
      {row: 3, col: 3, type: "xJunction"}
    ]
  },
  {
    gridSize: 6,
    dots: [
      {row: 0, col: 3, color: "green"}, {row: 5, col: 0, color: "green"},
      {row: 0, col: 5, color: "red"}, {row: 4, col: 1, color: "red"},
      {row: 1, col: 3, color: "blue"}, {row: 5, col: 2, color: "blue"},
      {row: 4, col: 5, color: "yellow"}, {row: 5, col: 3, color: "yellow"}
    ],
    specialBlocks: [
      {row: 4, col: 2, type: "xJunction"},
      {row: 3, col: 4, type: "xJunction"},
      {row: 1, col: 1, type: "xJunction"}  // will be overwritten by dot
    ]
  }
];

let currentLevel = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateGridDimensions();
  loadLevel(currentLevel);

}

function draw() {
  if (whatPhase === "starting phase") {
    startScreen();
  }
  else if (whatPhase === "connect phase") {
    background(20, 50, 100);
    drawGrid();
    drawDots();
    drawCompletedPaths();
    drawDragPath();

    // Timer logic
    timeRemaining = max(0, levelTimeLimit - (millis() - levelStartTime));

    drawTimer();

    if (timeRemaining <= 0) {
      // Time's up — restart level or show fail message
      whatPhase = "starting phase"; // Or implement a "game over" screen
    }

    // Check win condition
    if (isGridFull()) {
      currentLevel++;
      if (currentLevel < levels.length) {
        loadLevel(currentLevel);
        levelStartTime = millis();  // reset timer
      } else {
        whatPhase = "starting phase"; // or win screen
      }
    }
  }
}


function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / gridDimensions * 0.9;
  xOffset = (width - cellSize * gridDimensions) / 2;
  yOffset = (height - cellSize * gridDimensions) / 2;
}

function startScreen() {
  background(30, 50, 100);
  rectMode(CENTER);

  // Calculate cols and rows for the animation grid based on canvas size and spacing
  cols = floor(width / spacing);
  rows = floor(height / spacing);

  // Calculate size of each rect based on distance to mouse
  for (let y = 0; y < rows; y++) {
    sizeGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      let posX = spacing / 2 + x * spacing;
      let posY = spacing / 2 + y * spacing;
      sizeGrid[y][x] = dist(mouseX, mouseY, posX, posY) * scaleAnim;
    }
  }

  // Draw the animated rectangles
  noStroke();
  fill(50);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let posX = spacing / 2 + x * spacing;
      let posY = spacing / 2 + y * spacing;
      rect(posX, posY, sizeGrid[y][x], sizeGrid[y][x]);
    }
  }

  // Draw title text
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Multiplayer Chess", width / 2, height / 2 - 100);

  // Draw start button
  let buttonX = width / 2;
  let buttonY = height / 2 + 50;
  let buttonWidth = 300;
  let buttonHeight = 70;
  let radius = 40;

  // Check if mouse is over the button
  let isHovered = mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 &&
                  mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2;

  if (isHovered) {
    fill(255);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, radius);
    fill(0);
    textSize(24);
    text("Start Game", buttonX, buttonY);

    if (mouseIsPressed) {
      whatPhase = "connect phase";  // Switch to main game phase
      levelStartTime = millis();    // ✅ Initialize the level timer
    }
  }
  else {
    fill(0);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, radius);
    fill(255);
    textSize(24);
    text("Start Game", buttonX, buttonY);
  }
}

function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  gridDimensions = level.gridSize;
  calculateGridDimensions();
  mainGrid = [];

  for (let y = 0; y < gridDimensions; y++) {
    const row = [];
    for (let x = 0; x < gridDimensions; x++) {
      row.push(null);
    }
    mainGrid.push(row);
  }

  // Place dots
  for (const dot of level.dots) {
    mainGrid[dot.row][dot.col] = dot.color;
  }

  // Place special blocks
  for (const block of level.specialBlocks) {
    mainGrid[block.row][block.col] = block.type;
  }

  completedPaths = [];
}


// 3) In your draw phase, render blockade-cells specially:
function drawGrid() {
  rectMode(CORNER);
  stroke(255);
  strokeWeight(1);

  for (let row = 0; row < gridDimensions; row++) {
    for (let col = 0; col < gridDimensions; col++) {
      const cell = mainGrid[row][col];
      const x = xOffset + col * cellSize;
      const y = yOffset + row * cellSize;

      if (cell === "metalBlockade") {
        fill(80);
        rect(x, y, cellSize, cellSize);
        stroke(120);
        line(x + 5, y + 5, x + cellSize - 5, y + cellSize - 5);
        line(x + cellSize - 5, y + 5, x + 5, y + cellSize - 5);
        stroke(255);
      }
      else if (cell === "xJunction") {
        fill(40);
        rect(x, y, cellSize, cellSize);
        stroke(200);
        strokeWeight(4);
        line(x + cellSize/2, y + 5,      x + cellSize/2, y + cellSize - 5);
        line(x + 5,        y + cellSize/2, x + cellSize - 5, y + cellSize/2);
        strokeWeight(1);
      }
      else {
        fill("black");
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}

// Keep drawDots() unchanged: it ignores non-dot strings, so "metalBlockade" won’t get a circle.


function drawDots() {
  for (let row = 0; row < gridDimensions; row++) {
    for (let col = 0; col < gridDimensions; col++) {
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

// 1) Start a drag only on a dot‐endpoint
function mousePressed() {
  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const c = mainGrid[row][col];
  if (c && dots.includes(c)) {
    isDragging = true;
    dragColor  = c;
    dragPath   = [{ row, col }];
  }
}

// 2) Continue the drag, with full xJunction‐aware collision logic
function mouseDragged() {
  if (!isDragging) {
    return;
  }

  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const last = dragPath[dragPath.length - 1];

  // A) Undo/backtrack?
  if (
    dragPath.length > 1 &&
    dragPath[dragPath.length - 2].row === row &&
    dragPath[dragPath.length - 2].col === col
  ) {
    dragPath.pop();
    return;
  }

  // B) No revisiting non-junction cells
  if (
    !(mainGrid[row][col] === "xJunction") &&
    dragPath.some(p => p.row === row && p.col === col)
  ) {
    return;
  }

  // C) Must be adjacent and a legal cell
  const val = mainGrid[row][col];
  if (
    !cellsAreAdjacent(last.row, last.col, row, col) ||
    !(val === null || val === dragColor || val === "xJunction")
  ) {
    return;
  }

  // D) Prepare the new segment coords
  const newA = cellToCenterXY(last);
  const newB = cellToCenterXY({ row, col });

  // E) Collision check: skip any test if either segment uses the junction
  let collisionRemoved = false;
  for (const pathObj of completedPaths) {
    const pts = pathObj.path;
    for (let i = 0; i < pts.length - 1; i++) {
      const oldA = cellToCenterXY(pts[i]);
      const oldB = cellToCenterXY(pts[i + 1]);

      const newTouchesJ = last.row === 2 && last.col === 1
                        || row      === 2 && col      === 1;
      const oldTouchesJ = pts[i].row === 2 && pts[i].col === 1
                        || pts[i+1].row === 2 && pts[i+1].col === 1;

      if (newTouchesJ || oldTouchesJ) {
        // legitimate crossing at xJunction — skip
        continue;
      }

      if (collideLineLine(
        newA.x, newA.y, newB.x, newB.y,
        oldA.x, oldA.y, oldB.x, oldB.y
      )) {
        removePath(pathObj);
        collisionRemoved = true;
        break;
      }
    }
    if (collisionRemoved) {
      break;
    }
  }

  // F) Finally, add the cell to your drag
  dragPath.push({ row, col });
}

// 3) Finish the drag: if you landed on a matching endpoint, commit it
function mouseReleased() {
  if (!isDragging) {
    return;
  }

  // Pure click on an endpoint: toggle its path
  if (dragPath.length === 1) {
    const { row, col } = dragPath[0];
    const color = mainGrid[row][col];
    for (let i = completedPaths.length - 1; i >= 0; i--) {
      const p = completedPaths[i];
      const start = p.path[0];
      const end   = p.path[p.path.length - 1];
      if (p.color === color && (
        start.row === row && start.col === col ||
            end  .row === row && end  .col === col
      )) {
        removePath(p);
        break;
      }
    }
    resetDrag();
    return;
  }

  // Otherwise, if you dragged to a matching dot, finalize it
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
  return row >= 0 && row < gridDimensions && col >= 0 && col < gridDimensions;
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
  for (let i = 1; i < pathObj.path.length - 1; i++) {
    const c = pathObj.path[i];
    if (mainGrid[c.row][c.col] !== "xJunction") {
      mainGrid[c.row][c.col] = null;
    }
  }
  const idx = completedPaths.indexOf(pathObj);
  if (idx !== -1) {
    completedPaths.splice(idx, 1);
  }
}


function drawTimer() {
  fill(255);
  textSize(24);
  textAlign(RIGHT, TOP);
  text(`Time Left: ${Math.ceil(timeRemaining / 1000)}`, width - 20, 20);
}

function isGridFull() {
  for (let row = 0; row < gridDimensions; row++) {
    for (let col = 0; col < gridDimensions; col++) {
      const val = mainGrid[row][col];
      if (val === null) return false;
    }
  }
  return true;
}
