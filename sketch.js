// Dot link
// Ranu Jayawickrama
// April 17th

// things to do////////////////////////
// commenting
// sound effects

// Grid dimensions
let gridDimensions = 6;
let cellSize;
let mainGrid = [];
let xOffset, yOffset;

// Path dragging variables
let dragPath = [];
let dragColor = null;
let isDragging = false;

// Start screen animation variables
let spacing = 30; // spacing between animated rectangles
let scaleAnim = 0.15; // how much size changes based on distance to mouse
let cols, rows;
let sizeGrid = []; // 2D array of rectangle sizes

// Instructions button variable
let instructionsHover = false;
let showInstructions = false;
let instructionsButtonX, instructionsButtonY;
let instructionsBoxWidth = 600;
let instructionsBoxHeight = 180;

// Start and return button setup
let buttonX, buttonY;
let buttonWidth = 320, buttonHeight = 70, radius = 40;

// Timer variables for each level
let levelStartTime;
let levelTimeLimit = 5000; // time limit in ms
let timeRemaining = levelTimeLimit;

//  dot colors and completed connections array
let dots = ["red", "green", "blue", "yellow", "orange", "white", "purple"];
let completedPaths = [];

let whatPhase; // current game phase (start, connect, win, loose)
let returnHover = false; // detect hovering for smooth transition when buttons are pressed
let startHover = false;

// Animated particle variables for outro screen
const DEFAULT_SPEED = 4;
const DEFAULT_RADIUS = 40;
const DEFAULT_REACH = 220;
const MAX_RADIUS = 65;
const MIN_RADIUS = 40;
const DELTA_TIME = 0.01;

let balls = []; //  animated balls
let idCounter = 0;
const MAX_BALLS = 40;
let spawnInterval = 1000; // 1 ball per second
let lastSpawnTime = 0;

// Firework animation variables for win screen
let showFireworks = false;
let winFastInterval, winSlowInterval;
let fireworks = [];
let launchers = [];
let duration = 3000; // time to run fast fireworks
let fastInterval = 300;
let slowInterval = 1500;

const NUMBER_OF_FIREWORKS_PER_CLICK = 20; // number of particles per explosion

let currentLevel = 0; 
let pixelFont; // custom pixel font

//levels 
let levels = [
  {
    // level 1
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
    // level 2
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
    // level 3
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
    // level 4
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
    // level 5
    gridSize: 6,
    timeLimit: 14000,
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

// Load font 
function preload() {
  pixelFont = loadFont('PressStart2P.ttf');
}

// Setup canvas, UI positions, font, and initialize level 0
function setup() {
  createCanvas(windowWidth, windowHeight);

  // button locations
  buttonX = width / 2; 
  buttonY = height / 2 + 50;
  instructionsButtonX = width / 2;
  textSize(20);
  instructionsButtonY = buttonY + buttonHeight + 10; // position instructions button under Start

  // make the largest possible grid within the window screen
  calculateGridDimensions();
  loadLevel(currentLevel); // load first level

  whatPhase = "start screen";

  // Gradient colors for ball  background
  GRADIENT_LEFT = color(255, 100, 150);     
  GRADIENT_RIGHT = color(100, 200, 255);    
  GRADIENT_TOP = color(255, 120, 80);       
  GRADIENT_BOTTOM = color(180, 100, 255);   

  textFont(pixelFont); // pixel type font
  balls.push(new MovingPoint(width / 2, height / 2)); // start with one ball in center

  colorMode(RGB);
  //console.log(windowWidth, windowHeight);
}

function draw() {
  background(20, 80, 100);

  if (whatPhase === "start screen") {
    startScreen(); // load the start menu
  }
  else if (whatPhase === "connect phase") { // load game
    updateTimer();
    drawTimer();
    drawGrid();
    drawCompletedPaths();
    drawDragPath();
    drawDots();

    // If time runs out, go to outro screen
    if (timeRemaining <= 0) {
      whatPhase = "outro screen";
    }
  }
  else if (whatPhase === "outro screen") { // run the outro screen
    runOutroScreen();
  }
  else if (whatPhase === "win screen") { // run the winner screen
    runWinScreen();
  }
}

// Calculate size and centering of each grid cell
function calculateGridDimensions() {
  const MINI_DIMENSIONS = min(width, height); // Fit to any screen dimension
  cellSize = MINI_DIMENSIONS / gridDimensions * 0.9;
  xOffset = (width - cellSize * gridDimensions) / 2; // Horizontal center offset
  yOffset = (height - cellSize * gridDimensions) / 2; // Vertical center offset
}

// Renders animated start screen with title, buttons, and instructions
function startScreen() {
  background(0, 220, 220);
  rectMode(CENTER);

  // Calculate animation grid based on screen size
  cols = floor(width / spacing);
  rows = floor(height / spacing);

  // calculate size of each animated rectangle based on mouse distance
  for (let y = 0; y < rows; y++) {
    sizeGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      let posX = spacing / 2 + x * spacing;
      let posY = spacing / 2 + y * spacing;
      sizeGrid[y][x] = dist(mouseX, mouseY, posX, posY) * scaleAnim;
    }
  }

  // Draw animated background rectangles
  noStroke();
  fill(50);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let posX = spacing / 2 + x * spacing;
      let posY = spacing / 2 + y * spacing;
      rect(posX, posY, sizeGrid[y][x], sizeGrid[y][x]);
    }
  }

  // Game title
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);
  text("Happy Connect", width / 2, height / 2 - 80);

  // Start button
  startHover = mouseX > buttonX - buttonWidth / 2 &&
               mouseX < buttonX + buttonWidth / 2 &&
               mouseY > buttonY - buttonHeight / 2 &&
               mouseY < buttonY + buttonHeight / 2;

  fill(startHover ? 255 : 0);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, radius);
  noStroke();
  fill(startHover ? 0 : 255);
  textSize(startHover ? 28 : 24);
  text("Start Game", buttonX, buttonY);

  // Instructions button
  instructionsHover = mouseX > instructionsButtonX - buttonWidth / 2 &&
                      mouseX < instructionsButtonX + buttonWidth / 2 &&
                      mouseY > instructionsButtonY - buttonHeight / 2 &&
                      mouseY < instructionsButtonY + buttonHeight / 2;

  fill(instructionsHover ? 255 : 0);
  rect(instructionsButtonX, instructionsButtonY, buttonWidth, buttonHeight, radius);
  fill(instructionsHover ? 0 : 255);
  textSize(instructionsHover ? 22 : 20);
  text("Instructions", instructionsButtonX, instructionsButtonY);

  // Show instruction panel when hovered
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

// Load a level by its index: sets grid size, time, and grid
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  gridDimensions = level.gridSize;
  levelTimeLimit = level.timeLimit;
  levelStartTime = millis();
  calculateGridDimensions();// calculate the dimensions of the grid when calling the level
  mainGrid = [];

  // Initially empty grid
  for (let y = 0; y < gridDimensions; y++) {
    const row = [];
    for (let x = 0; x < gridDimensions; x++) {
      row.push(null);
    }
    mainGrid.push(row);
  }

  // Place of colored dots on grid
  for (const dot of level.dots) {
    mainGrid[dot.row][dot.col] = dot.color;
  }

  // Place of special blocks (metalBlockade, xJunction)
  for (const block of level.specialBlocks) {
    mainGrid[block.row][block.col] = block.type;
  }

  completedPaths = [];
}

// Draws each cell of the grid, including special block visuals
function drawGrid() {
  rectMode(CORNER);
  stroke(255);
  strokeWeight(1);

  for (let row = 0; row < gridDimensions; row++) {
    for (let col = 0; col < gridDimensions; col++) {
      const cell = mainGrid[row][col];
      const x = xOffset + col * cellSize;
      const y = yOffset + row * cellSize;

      // draw metal blockade
      if (cell === "metalBlockade") {
        fill(80);
        rect(x, y, cellSize, cellSize);
        stroke(120);
        line(x + 5, y + 5, x + cellSize - 5, y + cellSize - 5);
        line(x + cellSize - 5, y + 5, x + 5, y + cellSize - 5);
        stroke(255);
      }

      // draw x junction
      else if (cell === "xJunction") {
        fill(40);
        rect(x, y, cellSize, cellSize);
        stroke(200);
        strokeWeight(4);
        line(x + cellSize / 2, y + 5, x + cellSize / 2, y + cellSize - 5);
        line(x + 5, y + cellSize / 2, x + cellSize - 5, y + cellSize / 2);
        strokeWeight(1);
      }

      // draw empty squares
      else {
        fill("black");
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}

// Draw all color dots from the grid onto the canvas
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

// Draw a single dot in the center of a grid cell
function displayDots(color, x, y) {
  const SIZE = cellSize * 0.4;
  const centerX = x + cellSize / 2;
  const centerY = y + cellSize / 2;
  fill(color);
  noStroke();
  circle(centerX, centerY, SIZE);
}

// Start dragging only when clicking on a colored dot
function mousePressed() {
  const { row, col } = getCellFromMouse();
  if (!isInsideGrid(row, col)) {
    return;
  }

  const retrieveStoredBlock = mainGrid[row][col];

  // Only begin drag if it's a dot, not a special block
  if (typeof retrieveStoredBlock === "string" && dots.includes(retrieveStoredBlock)) {
    isDragging = true;
    dragColor = retrieveStoredBlock;
    dragPath = [{ row, col }];
  }
}

// Handle dragging logic, including backtracking, collisions, and restrictions
function mouseDragged() {

  // check whether you are dragging or not 
  if (!isDragging) {
    return;
  }

  // Get the grid cell currently under the mouse
  const { row, col } = getCellFromMouse();

  // ignore if not within grid bounds
  if (!isInsideGrid(row, col)) {
    return;
  }
  
  // Get the last cell in the current drag path
  const last = dragPath[dragPath.length - 1];

  //  Allow undo by dragging backwards
  if (tryBacktrack(last, row, col)) {
    return;
  }

  //  can't keep two lines in one square (except xJunctions)
  if (blockedDueToRevisit(row, col)) {
    return;
  }

  const whatBlock = mainGrid[row][col];

  // Block dragging into metalBlockade
  if (whatBlock === "metalBlockade") {
    return;
  }

  // Force straight movement through xJunction
  if (mainGrid[last.row][last.col] === "xJunction" && dragPath.length >= 2) {
    const prev = dragPath[dragPath.length - 2];
    const prevDirR = last.row - prev.row;
    const prevDirC = last.col - prev.col;
    const newDirR = row - last.row;
    const newDirC = col - last.col;
    if (newDirR !== prevDirR || newDirC !== prevDirC) {
      return;
    }
  }

  // Prevent continuing from a completed dot in a new direction
  if (dots.includes(mainGrid[last.row][last.col]) && dragPath.length >= 2) {
    const prev = dragPath[dragPath.length - 2];
    const prevDirR = last.row - prev.row;
    const prevDirC = last.col - prev.col;
    const newDirR = row - last.row;
    const newDirC = col - last.col;
    if (newDirR !== 0 || newDirC !== 0) {
      return;
    }
  }

  // Only allow adjacent cells that are empty, same color, or xJunction
  if (!cellsAreAdjacent(last.row, last.col, row, col) ||
      !(whatBlock === null || whatBlock === dragColor || whatBlock === "xJunction")) {
    return;
  }

  // Prevent crossing over existing paths
  if (collidesWithExisting(last, { row, col })) {
    return;
  }

  dragPath.push({ row, col });
}

// Allow undo by dragging back to the previous cell
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

// Disallow revisiting cells already in the path unless it's an xJunction
function blockedDueToRevisit(row, col) {
  return (
    !xJunctionAt(row, col) &&
    dragPath.some(p => p.row === row && p.col === col)
  );
}

// Check if a cell is an xJunction
function xJunctionAt(row, col) {
  return mainGrid[row][col] === "xJunction";
}

// Only allow movement to adjacent cells and valid types
function isLegalMove(last, row, col, val) {
  return cellsAreAdjacent(last.row, last.col, row, col) &&
    (val === null || val === dragColor || val === "xJunction");
}

// Check for collisions with existing completed paths
function collidesWithExisting(last, newCell) {
  const newA = cellToCenterXY(last);
  const newB = cellToCenterXY(newCell);
  for (const pathObj of completedPaths) {
    const pts = pathObj.path;
    for (let i = 0; i < pts.length - 1; i++) {
      const oldA = cellToCenterXY(pts[i]);
      const oldB = cellToCenterXY(pts[i + 1]);

      // Skip collision check if any segment involves an xJunction
      if (
        xJunctionAt(last.row, last.col) ||
        xJunctionAt(newCell.row, newCell.col) ||
        xJunctionAt(pts[i].row, pts[i].col) ||
        xJunctionAt(pts[i + 1].row, pts[i + 1].col)
      ) {
        continue;
      }

      // Check line intersection
      if (
        collideLineLine(
          newA.x, newA.y, newB.x, newB.y,
          oldA.x, oldA.y, oldB.x, oldB.y
        )
      ) {
        removePath(pathObj);
        return true;
      }
    }
  }
  return false;
}

// Handle mouse release based on game phase and path logic
function mouseReleased() {
  // Return to start screen from outro screen
  if (whatPhase === "outro screen" && returnHover) {
    stopFireworks();
    whatPhase = "start screen";
    currentLevel = 0;
    loadLevel(currentLevel);
    resetDrag();
    return;
  }

  // Return to start screen from win screen and stop fireworks
  if (whatPhase === "win screen" && returnHover) {
    clearInterval(winFastInterval);
    clearInterval(winSlowInterval);
    launchers = [];
    fireworks = [];
    showFireworks = false;

    whatPhase = "start screen";
    currentLevel = 0;
    loadLevel(currentLevel);
    resetDrag();
    return;
  }

  // Start game from start screen when Start button is clicked
  if (whatPhase === "start screen" && startHover) {
    whatPhase = "connect phase";
    levelStartTime = millis();
    loadLevel(currentLevel);
    levelStartTime = millis();        // Restart timer
    timeRemaining = levelTimeLimit;
    balls = []; // Clear outro animation
    idCounter = 0;
    return;
  }

  // Do nothing if mouse released without dragging
  if (!isDragging) {
    return;
  }

  // If only one cell was dragged, check for dot re-click (erase path)
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
        removePath(p); // Remove matching path
        break;
      }
    }
    resetDrag();
    return;
  }

  // If two matching dots were successfully connected, save the path
  if (dragPath.length >= 2) {
    const start = dragPath[0];
    const end = dragPath[dragPath.length - 1];
    if (
      mainGrid[end.row][end.col] === dragColor &&
      (start.row !== end.row || start.col !== end.col)
    ) {
      completedPaths.push({ color: dragColor, path: [...dragPath] });
      checkWin(); // Check if all paths are completed
    }
  }

  resetDrag(); // Always reset dragging path on mouse release
}

// Convert current mouse position into grid cell coordinates
function getCellFromMouse() {
  const col = floor((mouseX - xOffset) / cellSize);
  const row = floor((mouseY - yOffset) / cellSize);
  return { row, col };
}

// Check if a cell is within the grid bounds
function isInsideGrid(row, col) {
  return row >= 0 && row < gridDimensions && col >= 0 && col < gridDimensions;
}

// Check if two cells are directly adjacent (up/down/left/right)
function cellsAreAdjacent(r1, c1, r2, c2) {
  return abs(r1 - r2) + abs(c1 - c2) === 1;
}

// Reset the current drag state
function resetDrag() {
  dragPath = [];
  dragColor = null;
  isDragging = false;
}

// Draw the currently dragged path in progress
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

// Draw all completed (saved) paths on the grid
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

// Convert a grid cell to its center pixel coordinates
function cellToCenterXY(cell) {
  return {
    x: xOffset + cell.col * cellSize + cellSize / 2,
    y: yOffset + cell.row * cellSize + cellSize / 2
  };
}

// Remove a completed path from the grid and data
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

// Draw the level timer as a bar and countdown text
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

  // Foreground bar (color transitions from red to green)
  fill(lerpColor(color(255, 0, 0), color(0, 255, 0), percentLeft));
  rect(x, y, barWidth * percentLeft, barHeight);

  // Countdown text
  fill(255);
  textAlign(RIGHT, CENTER);
  textSize(16);
  text(`Time Left: ${ceil(timeRemaining / 1000)}s`, x + barWidth, y + barHeight + 12);
}

// Check if every cell on the grid is filled
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

// Update the remaining time based on how long the level has been running
function updateTimer() {
  const elapsed = millis() - levelStartTime;
  timeRemaining = Math.max(levelTimeLimit - elapsed, 0);
}

// Check if all color pairs are completed, advance or end game
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
      // Last level completed → show win screen with fireworks
      whatPhase = "win screen";
      startFireworks();
    }
  }
  // No else needed — just wait for completion
}

// Draw animated outro screen background and final score
function runVisualBackground() {
  background(30);
  strokeWeight();

  // Update and draw each animated ball
  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  // Spawn new balls periodically, up to max allowed
  if (millis() - lastSpawnTime > spawnInterval && balls.length < MAX_BALLS) {
    balls.push(new MovingPoint(random(width), random(height)));
    lastSpawnTime = millis();
  }

  // Connect all nearby balls with lines
  strokeWeight(5);
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].connectTo(balls[j]);
    }
  }

  // Display 'GAME OVER' message
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("GAME OVER", width / 2, height / 2 - 150);

  // Show how many levels were completed
  textSize(40);
  text(`Levels Completed: ${currentLevel}`, width / 2, height / 2 - 70);

  // Show return-to-start button
  returnHover = mouseX > buttonX - buttonWidth / 2 &&
                mouseX < buttonX + buttonWidth / 2 &&
                mouseY > buttonY - buttonHeight / 2 &&
                mouseY < buttonY + buttonHeight / 2;

  fill(returnHover ? 255 : 0);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth * 2, buttonHeight, radius);

  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);
}

// Darken background and tint it based on ball colors
function updateBackgroundColor() {
  if (balls.length === 0) {
    background(20); // fallback color if no balls exist
    return;
  }

  let totalR = 0, totalG = 0, totalB = 0;

  for (let node of balls) {
    let w = map(node.x, 0, width, 1.5, 0.5); // left side influences more
    totalR += red(node.color) * w;
    totalG += green(node.color) * w;
    totalB += blue(node.color) * w;
  }

  let avgR = totalR / balls.length;
  let avgG = totalG / balls.length;
  let avgB = totalB / balls.length;

  background(avgR * 0.5, avgG * 0.5, avgB * 0.5); // darker blend
}

// Class for animated background balls used in outro screen
class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = DEFAULT_SPEED;
    this.radius = DEFAULT_RADIUS;
    this.reach = DEFAULT_REACH;
    this.maxRadius = MAX_RADIUS;
    this.minRadius = MIN_RADIUS;

    // Set color based on horizontal and vertical gradients
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);

    // For Perlin noise movement
    this.xTime = random(1000);
    this.yTime = random(1000);
    this.id = idCounter++;

    this.alpha = 0; // Fade in
    this.fadeSpeed = 5; // Speed of fade-in effect
  }

  // Update ball position and size
  update() {
    this.move();
    this.wrapAroundScreen();
    this.adjustSize();
  }

  // Draw the ball with fade-in alpha
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

    if (this.alpha < 255) {
      this.alpha += this.fadeSpeed;
      this.alpha = min(this.alpha, 255);
    }
  }

  // Change size based on distance to mouse
  adjustSize() {
    let mouseDistance = dist(mouseX, mouseY, this.x, this.y);
    if (mouseDistance < this.reach) {
      this.radius = map(mouseDistance, 0, this.reach, this.maxRadius, this.minRadius);
    }
    else {
      this.radius = this.minRadius;
    }
  }

  // Draw line to another ball if close enough
  connectTo(otherNode) {
    let distance = dist(this.x, this.y, otherNode.x, otherNode.y);
    if (distance < this.reach) {
      let alpha = map(distance, 0, this.reach, 255, 0);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      strokeWeight(5);
      line(this.x, this.y, otherNode.x, otherNode.y);
    }
  }

  // Update position using Perlin noise
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

  // Reappear on the opposite side when leaving screen bounds
  wrapAroundScreen() {
    let margin = this.radius;

    if (this.x < -margin) {
      this.x = width + margin;
      this.xTime = random(1000);
    }
    else if (this.x > width + margin) {
      this.x = -margin;
      this.xTime = random(1000);
    }

    if (this.y < -margin) {
      this.y = height + margin;
      this.yTime = random(1000);
    }
    else if (this.y > height + margin) {
      this.y = -margin;
      this.yTime = random(1000);
    }

    // Update color based on new position
    let horiz = lerpColor(GRADIENT_LEFT, GRADIENT_RIGHT, this.x / width);
    let vert = lerpColor(GRADIENT_TOP, GRADIENT_BOTTOM, this.y / height);
    this.color = lerpColor(horiz, vert, 0.5);
  }
}

// Start fireworks sequence on win screen
function startFireworks() {
  stopFireworks();        // Clear previous fireworks if active
  showFireworks = true;

  // Rapid fireworks for a short duration
  winFastInterval = setInterval(() => {
    launchers.push(new Launcher());
  }, fastInterval);

  // After delay, switch to slower fireworks
  setTimeout(() => {
    clearInterval(winFastInterval);
    winSlowInterval = setInterval(() => {
      launchers.push(new Launcher());
    }, slowInterval);
  }, duration);
}

// Stop all fireworks and clear related arrays and timers
function stopFireworks() {
  showFireworks = false;
  clearInterval(winFastInterval);
  clearInterval(winSlowInterval);
  launchers = [];
  fireworks = [];
}

// Represents a single firework particle
class Particle {
  constructor(x, y, dx, dy, particleColours) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 3;
    this.color = particleColours;
    this.opacity = 255; // starts fully visible
  }

  // Draw the particle with transparency
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  // Update position and reduce opacity to fade out
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.opacity -= 3.5;
  }

  // Mark particle as dead once fully faded
  isDead() {
    return this.opacity <= 0;
  }
}

// Represents a full firework explosion made of many particles
class Firework {
  constructor(x, y, count) {
    this.particles = [];
    this.startColor = color(random(255), random(255), random(255));
    this.endColor = color(random(255), random(255), random(255));

    // Create particles with angles and speeds radiating out
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

  // Update all particles and remove dead ones
  update() {
    for (let p of this.particles) {
      p.update();
    }
    this.particles = this.particles.filter(p => !p.isDead());
  }

  // Display all particles
  display() {
    for (let p of this.particles) {
      p.display();
    }
  }

  // Firework is done when all particles are gone
  isDead() {
    return this.particles.length === 0;
  }
}

// Launches a firework upward, leaves trail, and explodes
class Launcher {
  constructor() {
    this.x = width / 2;
    this.y = height * 7 / 8;
    this.angle = random(-PI / 4, -3 * PI / 4); // upward spread
    this.speed = random(8, 10);
    this.dx = cos(this.angle) * this.speed;
    this.dy = sin(this.angle) * this.speed;
    this.trail = [];
    this.maxTrail = 3;
    this.exploded = false;
  }

  // Update position and trigger explosion
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

    // Trigger explosion at upper region of screen
    if (this.y < random(height / 4, height / 3)) {
      fireworks.push(new Firework(this.x, this.y, NUMBER_OF_FIREWORKS_PER_CLICK));
      this.exploded = true;
    }
  }

  // Draw launcher trail and current position
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

  // Considered done once exploded
  isDead() {
    return this.exploded;
  }
}

// Win screen with fireworks and stats display
function runWinScreen() {
  // 1) Start auto-firework sequence on first entry
  if (!showFireworks) {
    showFireworks = true;

    // Fast firework bursts for initial 3 seconds
    winFastInterval = setInterval(() => launchers.push(new Launcher()), fastInterval);
    setTimeout(() => {
      clearInterval(winFastInterval);

      // Then switch to slower interval bursts
      winSlowInterval =
        setInterval(() => launchers.push(new Launcher()), slowInterval);
    }, duration);
  }

  // 2) Dimmed trail background for visual persistence
  background(0, 0, 0, 30);

  // 3) Update and render all launchers and fireworks
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

  // 4) Show win message and return button
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text(" YOU WIN! ", width / 2, height / 2 - 150);
  textSize(40);
  text(`Levels Completed: ${levels.length}`, width / 2, height / 2 - 70);

  // Hover detection for return button
  returnHover = mouseX > buttonX - buttonWidth
             && mouseX < buttonX + buttonWidth
             && mouseY > buttonY - buttonHeight / 2
             && mouseY < buttonY + buttonHeight / 2;

  fill(returnHover ? 255 : 0);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth * 2, buttonHeight, radius);

  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);
}

// Continuously update all fireworks and launchers if active
function updateFireworks() {
  if (!showFireworks) {
    return;
  }

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
}

// Game over outro screen with ambient animation and stats
function runOutroScreen() {
  updateBackgroundColor();

  // Animate background balls
  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  // Spawn more background balls if under limit
  if (millis() - lastSpawnTime > spawnInterval && balls.length < MAX_BALLS) {
    balls.push(new MovingPoint(random(width), random(height)));
    lastSpawnTime = millis();
  }

  // Draw connections between nearby balls
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].connectTo(balls[j]);
    }
  }

  // Display game over text and levels completed
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(80);
  text("GAME OVER", width / 2, height / 2 - 150);
  textSize(40);
  text(`Levels Completed: ${currentLevel}`, width / 2, height / 2 - 70);

  // Return to Start button logic
  returnHover = mouseX > buttonX - buttonWidth
             && mouseX < buttonX + buttonWidth
             && mouseY > buttonY - buttonHeight / 2
             && mouseY < buttonY + buttonHeight / 2;

  fill(returnHover ? 255 : 0);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth * 2, buttonHeight, radius);

  noStroke();
  fill(returnHover ? 0 : 255);
  textSize(28);
  text("Return to Start", buttonX, buttonY);
}
