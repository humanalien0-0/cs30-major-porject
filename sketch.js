// Dot link
// Ranu Jayawickrama
// April 17th

// things to do////////////////////////
// commenting
// reflections
// create feedback.md
// sound effects



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

let instructionsHover = false;
let showInstructions = false;
let instructionsButtonX, instructionsButtonY;
let instructionsBoxWidth = 600;
let instructionsBoxHeight = 180;


let buttonX, buttonY, buttonWidth = 320, buttonHeight = 70, radius = 40;
let levelStartTime;
let levelTimeLimit = 5000; // 5 seconds in milliseconds
let timeRemaining = levelTimeLimit;

let dots = ["red", "green", "blue", "yellow", "orange", "white", "purple"];
let completedPaths = []; // Stores valid finished paths

let whatPhase;
let returnHover = false;
let startHover = false;

//outro screen
const DEFAULT_SPEED = 4;
const DEFAULT_RADIUS = 40;
const DEFAULT_REACH = 220;
const MAX_RADIUS = 65;
const MIN_RADIUS = 40;
const DELTA_TIME = 0.01;

let balls = [];
let idCounter = 0;
const MAX_BALLS = 40;
let spawnInterval = 1000; // spawn every 1000ms = 1 second
let lastSpawnTime = 0;

//winner screen
let showFireworks = false;
let winFastInterval, winSlowInterval;
let fireworks = [];
let launchers = [];
let duration = 3000; // 3 seconds
let fastInterval = 300;  // 0.3 seconds
let slowInterval = 1500;  // 0.5 seconds

const NUMBER_OF_FIREWORKS_PER_CLICK = 20;

let currentLevel = 0;
let pixelFont;


let levels = [
  {
    gridSize: 3,
    timeLimit: 5000,
    dots: [
      {row: 0, col: 0, color: "red"}, {row: 0, col: 2, color: "red"},
      {row: 1, col: 0, color: "green"}, {row: 1, col: 2, color: "green"},
      {row: 2, col: 0, color: "blue"}, {row: 2, col: 2, color: "blue"}
    ],
    specialBlocks: []
  },
  {
    gridSize: 5,
    timeLimit: 10000,
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
    timeLimit: 9000,
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
    timeLimit: 8000,
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
    timeLimit: 12000,
    dots: [
      {row: 0, col: 0, color: "green"}, {row: 5, col: 3, color: "green"},
      {row: 0, col: 2, color: "red"}, {row: 4, col: 3, color: "red"},
      {row: 0, col: 3, color: "blue"}, {row: 1, col: 5, color: "blue"},
      {row: 4, col: 1, color: "yellow"}, {row: 5, col: 5, color: "yellow"}
    ],
    specialBlocks: [
      {row: 1, col: 0, type: "metalBlockade"},
      {row: 1, col: 2, type: "xJunction"},
      {row: 2, col: 4, type: "xJunction"}  
    ]
  }
];

function preload() {
  pixelFont = loadFont('PressStart2P.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2 + 50;
  instructionsButtonX = width / 2;
  textSize(20);
  instructionsButtonY = buttonY + buttonHeight  + 10;  // below "Start Game" button

  calculateGridDimensions();
  loadLevel(currentLevel);
  whatPhase = "start screen";
  GRADIENT_LEFT = color(255, 100, 150);  // Pinkish (left)
  GRADIENT_RIGHT = color(100, 200, 255); // Bluish (right)

  GRADIENT_TOP = color(255, 120, 80);    // Orangish (top)
  GRADIENT_BOTTOM = color(180, 100, 255); // Purplish (bottom)

  textFont(pixelFont);
  // Add one starting node in the center
  balls.push(new MovingPoint(width / 2, height / 2));

  colorMode(RGB);
}

function draw() {
  background(20, 80, 100);

  if (whatPhase === "start screen")  {
    startScreen();
  }
  else if (whatPhase === "connect phase") {
    updateTimer();
    drawTimer();
    drawGrid();
    drawCompletedPaths();
    drawDragPath();
    drawDots();
    if (timeRemaining <= 0) {
      whatPhase = "outro screen";
    }
  }
  else if (whatPhase === "outro screen")  {
    runOutroScreen();
  }
  else if (whatPhase === "win screen")    {
    runWinScreen();
  }
}

function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height);
  cellSize = MINI_DIMENSIONS / gridDimensions * 0.9;
  xOffset = (width - cellSize * gridDimensions) / 2;
  yOffset = (height - cellSize * gridDimensions) / 2;
}

function startScreen() {
  background(0, 220, 220);
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
  textSize(80);
  text("Happy Connect", width / 2, height / 2 - 80);

  // Draw start button
  startHover = mouseX > buttonX - buttonWidth/2 &&
               mouseX < buttonX + buttonWidth/2 &&
               mouseY > buttonY - buttonHeight/2 &&
               mouseY < buttonY + buttonHeight/2;

  fill(startHover ? 255 : 0);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, radius);

  noStroke();
  fill(startHover ? 0 : 255);
  textSize(startHover ? 28 : 24);
  textAlign(CENTER, CENTER);
  text("Start Game", buttonX, buttonY);

  // --- Instructions Button ---
  instructionsHover = mouseX > instructionsButtonX - buttonWidth / 2 &&
                    mouseX < instructionsButtonX + buttonWidth / 2 &&
                    mouseY > instructionsButtonY - buttonHeight / 2 &&
                    mouseY < instructionsButtonY + buttonHeight / 2;

  fill(instructionsHover ? 255 : 0);
  rect(instructionsButtonX, instructionsButtonY, buttonWidth, buttonHeight, radius);
  fill(instructionsHover ? 0 : 255);
  textSize(instructionsHover ? 22 : 20);
  textAlign(CENTER, CENTER);
  text("Instructions", instructionsButtonX, instructionsButtonY);

  // --- Instruction Panel ---
  if (instructionsHover) {
    let boxWidth = 700;
    let boxHeight = 150;
    let boxX = width / 2;
    let boxY = instructionsButtonY + 140;

    fill(0, 200);
    rectMode(CENTER);
    rect(boxX, boxY, boxWidth, boxHeight, 20);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(14);

    let instructionsText = "Drag from one colored dot to its matching pair\n" +
                         "Fill the entire grid before time runs out\n" +
                         "Erase a trail by click its matching dots.\n" +
                         "The + block is a 4-way junction with no turns.\n" +
                         "The X block is a closed road\n";

    text(instructionsText, boxX, boxY, boxWidth - 40, boxHeight - 40);
  }
}

function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  gridDimensions = level.gridSize;
  levelTimeLimit = level.timeLimit;
  levelStartTime = millis();
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
      if (dots.includes(dotColor)) {
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

  // Only start drag on actual color dots, not special blocks
  if (typeof c === "string" && dots.includes(c)) {
    isDragging = true;
    dragColor = c;
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

  // A) Undo/backtrack?
  if (tryBacktrack(last, row, col)) {
    return;
  }

  // B) No revisiting (except xJunction)
  if (blockedDueToRevisit(row, col)) {
    return;
  }

  const val = mainGrid[row][col];
  // ❌ Block metalBlockade
  if (val === "metalBlockade") {
    return;
  }

  // ——— NEW: enforce straight‐through on xJunction ———
  // if the cell you just left is an xJunction, you must keep going in the same direction
  if (mainGrid[last.row][last.col] === "xJunction" && dragPath.length >= 2) {
    const prev = dragPath[dragPath.length - 2];
    // direction vector you came into the junction
    const prevDirR = last.row  - prev.row;
    const prevDirC = last.col  - prev.col;
    // direction vector you’d go out
    const newDirR  = row     - last.row;
    const newDirC  = col     - last.col;
    // if it’s not exactly the same vector, disallow
    if (newDirR !== prevDirR || newDirC !== prevDirC) {
      return;
    }
  }
  if (dots.includes(mainGrid[last.row][last.col]) && dragPath.length >= 2) {
    const prev = dragPath[dragPath.length - 2];
    const prevDirR = last.row  - prev.row;
    const prevDirC = last.col  - prev.col;
    const newDirR  = row     - last.row;
    const newDirC  = col     - last.col;

    // If you try to continue after hitting a colored dot → block it
    if (newDirR !== 0 || newDirC !== 0) {
      return;
    }
  }

  // C) Must be adjacent & either empty, same color, or junction
  if (
    !cellsAreAdjacent(last.row, last.col, row, col) ||
    !(val === null || val === dragColor || val === "xJunction")
  ) {
    return;
  }

  // D) Collision detection with existing completed paths
  if (collidesWithExisting(last, { row, col })) {
    return;
  }

  dragPath.push({ row, col });
}

// A) Undo/backtrack?
function tryBacktrack(last, row, col) {
  if (
    dragPath.length > 1 &&
    dragPath[dragPath.length - 2].row === row &&
    dragPath[dragPath.length - 2].col === col
  ) {
    dragPath.pop();
    return true;
  }
  return false;
}

// B) No revisiting (except xJunction)
function blockedDueToRevisit(row, col) {
  return (
    !xJunctionAt(row, col) &&
    dragPath.some(p => p.row === row && p.col === col)
  );
}

function xJunctionAt(row, col) {
  return mainGrid[row][col] === "xJunction";
}

// C) Must be adjacent and valid cell
function isLegalMove(last, row, col, val) {
  return cellsAreAdjacent(last.row, last.col, row, col) &&
    (val === null || val === dragColor || val === "xJunction");
}

// D) Collision detection with existing completed paths
function collidesWithExisting(last, newCell) {
  const newA = cellToCenterXY(last);
  const newB = cellToCenterXY(newCell);
  for (const pathObj of completedPaths) {
    const pts = pathObj.path;
    for (let i = 0; i < pts.length - 1; i++) {
      const oldA = cellToCenterXY(pts[i]);
      const oldB = cellToCenterXY(pts[i + 1]);

      if (
        xJunctionAt(last.row, last.col) || xJunctionAt(newCell.row, newCell.col) ||
        (xJunctionAt(pts[i].row, pts[i].col) || xJunctionAt(pts[i+1].row, pts[i+1].col))
      ) {
        continue;
      }

      if (collideLineLine(
        newA.x, newA.y, newB.x, newB.y,
        oldA.x, oldA.y, oldB.x, oldB.y
      )) {
        removePath(pathObj);
        return true;
      }
    }
  }
  return false;
}

function mouseReleased() {
  if (whatPhase === "outro screen" && returnHover) {
    stopFireworks();
    whatPhase = "start screen";
    currentLevel = 0;
    loadLevel(currentLevel);
    resetDrag();
    return;
  }

  if (whatPhase === "win screen" && returnHover) {
    // stop the win-screen fireworks
    clearInterval(winFastInterval);
    clearInterval(winSlowInterval);
    launchers = [];
    fireworks = [];
    showFireworks = false;
    

    // reset the game
    whatPhase = "start screen";
    currentLevel = 0;
    loadLevel(currentLevel);
    resetDrag();
    return;
  }

  if (whatPhase === "start screen" && startHover) {
    whatPhase = "connect phase";
    levelStartTime = millis();
    loadLevel(currentLevel);
    levelStartTime = millis();        // ← important!
    timeRemaining = levelTimeLimit;
    balls = [];
    idCounter = 0;
    return; // Skip any dragging
  }

  if (!isDragging) {
    return;
  }

  if (dragPath.length === 1) {
    const { row, col } = dragPath[0];
    const color = mainGrid[row][col];
    for (let i = completedPaths.length - 1; i >= 0; i--) {
      const p = completedPaths[i];
      const start = p.path[0];
      const end = p.path[p.path.length - 1];
      if (p.color === color && (
        start.row === row && start.col === col ||
        end.row === row && end.col === col
      )) {
        removePath(p);
        break;
      }
    }
    resetDrag();
    return;
  }

  if (dragPath.length >= 2) {
    const start = dragPath[0];
    const end = dragPath[dragPath.length - 1];
    if (
      mainGrid[end.row][end.col] === dragColor &&
      (start.row !== end.row || start.col !== end.col)
    ) {
      completedPaths.push({ color: dragColor, path: [...dragPath] });
      checkWin();  // ✅ Added win condition check
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
  const barWidth = 300;
  const barHeight = 20;
  const margin = 30;

  // Position
  const x = width - barWidth - margin;
  const y = margin;

  // Percent of time left
  const percentLeft = timeRemaining / levelTimeLimit;

  // Background bar
  noStroke();
  fill(80);
  rect(x, y, barWidth, barHeight);

  // Foreground bar (health)
  fill(lerpColor(color(255, 0, 0), color(0, 255, 0), percentLeft));  // red to green
  rect(x, y, barWidth * percentLeft, barHeight);

  // Optional: add text
  fill(255);
  textAlign(RIGHT, CENTER);
  textSize(16);
  text(`Time Left: ${ceil(timeRemaining / 1000)}s`, x + barWidth, y + barHeight + 12);
}


function isGridFull() {
  for (let row = 0; row < gridDimensions; row++) {
    for (let col = 0; col < gridDimensions; col++) {
      const val = mainGrid[row][col];
      if (val === null) {
        return false;
      }
    }
  }
  return true;
}

function updateTimer() {
  const elapsed = millis() - levelStartTime;
  timeRemaining = Math.max(levelTimeLimit - elapsed, 0);
}

function checkWin() {
  const totalPairs = levels[currentLevel].dots.length / 2;
  if (completedPaths.length === totalPairs) {
    if (currentLevel < levels.length - 1) {
      // Advance to the next level
      currentLevel++;
      loadLevel(currentLevel);
      levelStartTime = millis();
    }
    else {
      // Last level completed → go to WIN screen
      whatPhase = "win screen";
      startFireworks();
    }
  }
  // NO else branch here
}


// this is the outro screen code
function runVisualBackground() {
  background(30);
  strokeWeight();
  // Animated background
  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  if (millis() - lastSpawnTime > spawnInterval && balls.length < MAX_BALLS) {
    balls.push(new MovingPoint(random(width), random(height)));
    lastSpawnTime = millis();
  }
  strokeWeight(5);
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].connectTo(balls[j]);
    }
  }

  // "GAME OVER" text
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("GAME OVER", width / 2, height / 2 - 150);

  // Completed level count
  textSize(40);
  text(`Levels Completed: ${currentLevel}`, width / 2, height / 2 - 70);

  // Return button
  returnHover = mouseX > buttonX - buttonWidth / 2 &&
                mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 &&
                mouseY < buttonY + buttonHeight / 2;

  if (returnHover) {
    fill(255);
  }
  else {
    fill(0); 
  }
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth*2, buttonHeight, radius);

  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);

}

function updateBackgroundColor() {
  if (balls.length === 0) {
    background(20); // very dark if nothing is on screen
    return;
  }

  let totalR = 0, totalG = 0, totalB = 0;

  for (let node of balls) {
    let w = map(node.x, 0, width, 1.5, 0.5);
    totalR += red(node.color) * w;
    totalG += green(node.color) * w;
    totalB += blue(node.color) * w;
  }

  let avgR = totalR / balls.length;
  let avgG = totalG / balls.length;
  let avgB = totalB / balls.length;

  // Darker background with color influence
  background(avgR * 0.5, avgG * 0.5, avgB * 0.5);
}

class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = DEFAULT_SPEED;
    this.radius = DEFAULT_RADIUS;
    this.reach = DEFAULT_REACH;
    this.maxRadius = MAX_RADIUS;
    this.minRadius = MIN_RADIUS;
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);

    this.xTime = random(1000);
    this.yTime = random(1000);
    this.id = idCounter++;
    this.alpha = 0;
    this.fadeSpeed = 5; // controls how fast it fades in

  }

  update() {
    this.move();
    this.wrapAroundScreen();
    this.adjustSize();
  }

  display() {
    noStroke();
    let fadedColor = color(
      red(this.color),
      green(this.color),
      blue(this.color),
      this.alpha
    );
    fill(fadedColor);
    circle(this.x, this.y, this.radius * 2);

    // Gradually increase alpha for fade-in
    if (this.alpha < 255) {
      this.alpha += this.fadeSpeed;
      this.alpha = min(this.alpha, 255);
    }
  }

  adjustSize() {
    let mouseDistance = dist(mouseX, mouseY, this.x, this.y);
    if (mouseDistance < this.reach) {
      this.radius = map(mouseDistance, 0, this.reach, this.maxRadius, this.minRadius);
    }
    else {
      this.radius = this.minRadius;
    }
  }

  connectTo(otherNode) {
    let distance = dist(this.x, this.y, otherNode.x, otherNode.y);
    if (distance < this.reach) {
      let alpha = map(distance, 0, this.reach, 255, 0);
      stroke(
        red(this.color),
        green(this.color),
        blue(this.color),
        alpha
      );
      strokeWeight(5);
      line(this.x, this.y, otherNode.x, otherNode.y);
    }
  }

  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);

    dx = map(dx, 0, 1, -this.speed, this.speed);
    dy = map(dy, 0, 1, -this.speed, this.speed);

    this.x += dx;
    this.y += dy;

    this.xTime += DELTA_TIME;
    this.yTime += DELTA_TIME;
  }

  wrapAroundScreen() {
    let margin = this.radius;

    // Smooth horizontal wrapping
    if (this.x < -margin) {
      this.x = width + margin;
      this.xTime = random(1000);
    }
    else if (this.x > width + margin) {
      this.x = -margin;
      this.xTime = random(1000);
    }

    // Smooth vertical wrapping
    if (this.y < -margin) {
      this.y = height + margin;
      this.yTime = random(1000);
    }
    else if (this.y > height + margin) {
      this.y = -margin;
      this.yTime = random(1000);
    }

    // Recalculate color based on new position
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);
  }
}

function startFireworks() {
  stopFireworks();        // clear any previous intervals
  showFireworks = true;

  // Fast blasts for 3s
  winFastInterval = setInterval(() => {
    launchers.push(new Launcher());
  }, fastInterval);

  setTimeout(() => {
    clearInterval(winFastInterval);
    // Then slow blasts indefinitely
    winSlowInterval = setInterval(() => {
      launchers.push(new Launcher());
    }, slowInterval);
  }, duration);
}

function stopFireworks() {
  showFireworks = false;
  clearInterval(winFastInterval);
  clearInterval(winSlowInterval);
  launchers = [];
  fireworks = [];
}


class Particle {
  constructor(x, y, dx, dy, particleColours) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 3;
    this.color = particleColours;
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 3.5;
  }

  isDead() {
    return this.opacity <= 0;
  }
}

class Firework {
  constructor(x, y, count) {
    this.particles = [];
    this.startColor = color(random(255), random(255), random(255));
    this.endColor = color(random(255), random(255), random(255));

    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI);
      let speed = random(3, 6);
      let dx = cos(angle) * speed;
      let dy = sin(angle) * speed;

      let FlightTime = i / count; // from 0 to 1
      let colours = lerpColor(this.startColor, this.endColor, FlightTime);

      this.particles.push(new Particle(x, y, dx, dy, colours));
    }
  }

  update() {
    for (let p of this.particles) {
      p.update();
    }
    this.particles = this.particles.filter(p => !p.isDead());
  }

  display() {
    for (let p of this.particles) {
      p.display();
    }
  }

  isDead() {
    return this.particles.length === 0;
  }
}

class Launcher {
  constructor() {
    this.x = width / 2;
    this.y = height *7/8;
    this.angle = random(-PI / 4, -3 * PI / 4); // mostly upward, some spread
    this.speed = random(8, 10);
    this.dx = cos(this.angle) * this.speed;
    this.dy = sin(this.angle) * this.speed;
    this.trail = [];
    this.maxTrail = 3;
    this.exploded = false;
  }

  update() {
    if (this.exploded) {
      return;
    }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    this.x += this.dx;
    this.y += this.dy;

    // explosion trigger condition
    if (this.y < random(height / 4, height / 3)) {
      fireworks.push(new Firework(this.x, this.y, NUMBER_OF_FIREWORKS_PER_CLICK));
      this.exploded = true;
    }
  }

  display() {
    if (this.exploded) {
      return;
    }

    noFill();
    stroke(255);
    for (let i = 1; i < this.trail.length; i++) {
      let a = this.trail[i - 1];
      let b = this.trail[i];
      stroke(255, map(i, 0, this.trail.length, 50, 1));
      line(a.x, a.y, b.x, b.y);
    }

    noStroke();
    fill(255);
    circle(this.x, this.y, 5);
  }

  isDead() {
    return this.exploded;
  }
}

function runWinScreen() {
  // 1) On first entry, kick off the auto–fire sequence:
  if (!showFireworks) {
    showFireworks = true;
    // fast bursts for 3s:
    winFastInterval = setInterval(() => launchers.push(new Launcher()), fastInterval);
    setTimeout(() => {
      clearInterval(winFastInterval);
      winSlowInterval =
      setInterval(() => launchers.push(new Launcher()), slowInterval);
    }, duration);
  }

  // 2) Fade-trail background (from your desired screen)
  background(0, 0, 0, 30);

  // 3) Update & render launchers + fireworks
  for (let l of launchers) {
    l.update();
    l.display();
  }
  launchers = launchers.filter(l => !l.isDead());

  for (let fw of fireworks) {
    fw.update();
    fw.display();
  }
  fireworks = fireworks.filter(fw => !fw.isDead());

  // 4) YOUR WIN TEXT & RETURN BUTTON
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("🎉 YOU WIN! 🎉", width / 2, height / 2 - 150);
  textSize(40);
  text(`Levels Completed: ${levels.length}`, width / 2, height / 2 - 70);

  returnHover = mouseX > buttonX - buttonWidth
             && mouseX < buttonX + buttonWidth
             && mouseY > buttonY - buttonHeight/2
             && mouseY < buttonY + buttonHeight/2;

  fill(returnHover ? 255 : 0);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth * 2, buttonHeight, radius);

  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);
}


function updateFireworks() {
  if (!showFireworks) {
    return;
  }

  // Launchers
  for (let l of launchers) {
    l.update();  l.display();
  }
  launchers = launchers.filter(l => !l.isDead());

  // Burst particles
  for (let fw of fireworks) {
    fw.update();  fw.display();
  }
  fireworks = fireworks.filter(fw => !fw.isDead());
}


function runOutroScreen() {
  updateBackgroundColor();
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
  // spawn new points...
  if (millis() - lastSpawnTime > spawnInterval && balls.length < MAX_BALLS) {
    balls.push(new MovingPoint(random(width), random(height)));
    lastSpawnTime = millis();
  }
  // draw connections...
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].connectTo(balls[j]);
    }
  }

  // GAME OVER text
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("GAME OVER", width/2, height/2 - 150);
  textSize(40);
  text(`Levels Completed: ${currentLevel}`, width/2, height/2 - 70);

  // Return button
  returnHover = mouseX > buttonX - buttonWidth
             && mouseX < buttonX + buttonWidth
             && mouseY > buttonY - buttonHeight/2
             && mouseY < buttonY + buttonHeight/2;

  fill(returnHover ? 255 : 0);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth*2, buttonHeight, radius);
  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);
}
