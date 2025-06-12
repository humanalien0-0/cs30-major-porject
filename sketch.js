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

let levels = [
  {
    gridSize: 3,
    timeLimit: 500000,
    dots: [
      {row: 0, col: 0, color: "red"}, {row: 0, col: 2, color: "red"},
      {row: 1, col: 0, color: "green"}, {row: 1, col: 2, color: "green"},
      {row: 2, col: 0, color: "blue"}, {row: 2, col: 2, color: "blue"}
    ],
    specialBlocks: []
  },
  {
    gridSize: 5,
    timeLimit: 500000,
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
    timeLimit: 500000,
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
    timeLimit: 500000,
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
    timeLimit: 500000,
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

let currentLevel = 0;
let pixelFont;
function preload() {
  pixelFont = loadFont('PressStart2P.ttf');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2 + 50;
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
}


function draw() {
  background(20, 80, 100);

  if (whatPhase === "start screen") {
    startScreen();  // Use the separate function to draw the start screen
  }

  else if (whatPhase === "connect phase") {
    updateTimer();
    drawTimer();

    drawGrid();
    drawCompletedPaths();
    drawDragPath();
    drawDots();

    if (timeRemaining <= 0) {
      whatPhase = "outro screen"; // Go back to start if time runs out
    }
  }

  else if (whatPhase === "outro screen") {
    runVisualBackground();
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
  textSize(15);
  text("Drag & Connect", width / 2, height / 2 + 120);

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

  if (tryBacktrack(last, row, col)) {
    return;
  }
  if (blockedDueToRevisit(row, col)) {
    return;
  }
  const val = mainGrid[row][col];
  if (val === "metalBlockade") {
    return;
  }
  if (!isLegalMove(last, row, col, val)) {
    return;
  }
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
    whatPhase = "start screen";
    currentLevel = 0;
    loadLevel(currentLevel);
    resetDrag(); // clear any stale drag data
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
  fill(255);
  textSize(24);
  textAlign(RIGHT, TOP);
  text(`Time Left: ${Math.ceil(timeRemaining / 1000)}`, width - 20, 20);
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
  const level = levels[currentLevel];
  const totalPairs = level.dots.length / 2;
  if (completedPaths.length === totalPairs) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      loadLevel(currentLevel);
      levelStartTime = millis();  // Reset timer
    }
    else {
      whatPhase = "win screen";  // Game over screen
    }
  }
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



// Connected Nodes with Gradient Dots & Dynamic Background



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
