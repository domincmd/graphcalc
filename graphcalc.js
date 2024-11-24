const canvasWidth = 600;
const canvasHeight = 600;
const pointCheckInterval = 8;

let zoom = 4;

const calculateTimes = 100;

let viewX = canvasWidth/2;
let viewY = canvasHeight/2;

const pointSize = 4

function createBackgroundLines() {
  stroke(150);
  noFill();
  line(0, viewY, canvasWidth, viewY); // Horizontal line
  line(viewX, 0, viewX, canvasHeight); // Vertical line
  fill(255);
  stroke(150);
  for (let x = 3; x < canvasWidth; x += pointCheckInterval) {
    line(x, viewY-3, x, viewY+3)
  }
  for (let y = 3; y < canvasHeight; y += pointCheckInterval) {
    line(y, viewX-3, y, viewX+3)
  }
  stroke(0)
}

function transformPointsTo(x, y) {
  // Convert relative coordinates to absolute screen coordinates
  return [viewX + x, viewY - y];
}

function drawPoints() {
  let points = [];
  for (let x = (1-calculateTimes/2)*pointCheckInterval; x < calculateTimes/2 * pointCheckInterval; x += pointCheckInterval) {
    // Use the relative x to calculate y
    const y = x / zoom; // Ensure factorial uses relative x

    // Store the relative coordinates
    points.push(createVector(x, y));

    console.log("X: " + x + " Y: " + y)

    // Convert to absolute coordinates for rendering
    const [absoluteX, absoluteY] = transformPointsTo(x, y);

    // Render the point
    ellipse(absoluteX, absoluteY, pointSize, pointSize);
  }
  return points;
}

function drawLines(points) {
  for (let i = 0; i < points.length - 1; i++) {
    const { x: currentX, y: currentY } = points[i];
    const { x: nextX, y: nextY } = points[i + 1];

    // Convert relative coordinates to absolute coordinates for rendering
    const [currentAbsoluteX, currentAbsoluteY] = transformPointsTo(currentX, currentY);
    const [nextAbsoluteX, nextAbsoluteY] = transformPointsTo(nextX, nextY);

    // Render the line
    line(currentAbsoluteX, currentAbsoluteY, nextAbsoluteX, nextAbsoluteY);
  }
}

function drawGraph() {
  console.clear()
  createCanvas(canvasWidth, canvasHeight);
  background(220);
  createBackgroundLines();

  // Compute and render points and lines
  const points = drawPoints();
  drawLines(points);
}

function setup() {
  drawGraph()
}

function draw() { //make this system support multiple keypresses at once
  if (keyIsPressed === true) {
    if (key == "w") {
      viewY += 10
      drawGraph()
    }
    if (key == "a") {
      viewX += 10
      drawGraph()
    }
    if (key == "s") {
      viewY += -10
      drawGraph()
    }
    if (key == "d") {
      viewX += -10
      drawGraph()
    }
    if (key == "ArrowUp") {
      zoom += 1
      drawGraph()
    }
    if (key == "ArrowDown" && zoom  > 1) {
      zoom += -1
      drawGraph()
    }
  }
}

