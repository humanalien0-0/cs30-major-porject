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



function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  circle(mouseX, mouseY, 50);
}
