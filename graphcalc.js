const canvasWidth = 600;
const canvasHeight = 600;
const pointCheckInterval = 8;



const movementSpeed = 5;

let zoom = 1;

const calculateTimes = 100;

let viewX = canvasWidth/2;
let viewY = canvasHeight/2;

const pointSize = 4

function createBackgroundLines() {
  
  
  
  if (zoom > 6) {
    stroke(0)
    stroke(100);
    line(0, viewY, canvasWidth, viewY); // Horizontal line
    line(viewX, 0, viewX, canvasHeight); // Vertical line
    alert("disabled stripes cuz its gettin too laggy")
    return
  }

  stroke(150);

  const step = pointCheckInterval / zoom;
  const startX = Math.floor(-viewX / step) * step;
  const startY = Math.floor(-viewY / step) * step;

  for (let x = startX; x < canvasWidth - viewX; x += step) {
    line(viewX + x, 0, viewX + x, canvasHeight);
  }
  for (let y = startY; y < canvasHeight - viewY; y += step) {
    line(0, viewY + y, canvasWidth, viewY + y);
  }
  stroke(100);
  line(0, viewY, canvasWidth, viewY); // Horizontal line
  line(viewX, 0, viewX, canvasHeight); // Vertical line
}

function transformPointsTo(x, y) {
  // Convert relative coordinates to absolute screen coordinates
  return [viewX + x, viewY - y];
}

function drawPoints(graphExpression, r, g, b) {
  stroke(r, g, b)
  let points = [];
  for (let x = (1-calculateTimes/2)*pointCheckInterval; x < calculateTimes/2 * pointCheckInterval; x += pointCheckInterval) {
    // Use the relative x to calculate y

    const y = eval(graphExpression) / zoom; // Ensure factorial uses relative x

    // Store the relative coordinates
    points.push(createVector(x/zoom, y));

    console.log("X: " + x/zoom + " Y: " + y)

    // Convert to absolute coordinates for rendering
    const [absoluteX, absoluteY] = transformPointsTo(x/zoom, y);

    // Render the point
    ellipse(absoluteX, absoluteY, pointSize, pointSize);
  }
  return points;
}

function drawLines(points, r, g, b) {
  stroke(r, g, b)
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
  let points = drawPoints("x*x", 255, 0, 0);
  drawLines(points, 255, 0, 0);

  points = drawPoints("x*2", 0, 0, 255);
  drawLines(points, 0, 0, 255);
}

function setup() {
  drawGraph()
}

function draw() {
  let moved = false;

  if (keys["w"]) {
    viewY += movementSpeed;
    moved = true;
  }
  if (keys["a"]) {
    viewX += movementSpeed;
    moved = true;
  }
  if (keys["s"]) {
    viewY -= movementSpeed;
    moved = true;
  }
  if (keys["d"]) {
    viewX -= movementSpeed;
    moved = true;
  }

  if (moved) {
    drawGraph();
  }
}

function keyPressed() {
  if (key == "ArrowUp") {
    zoom += 1
    drawGraph()
  }
  if (key == "ArrowDown" && zoom > 1) {
    zoom += -1
    drawGraph()
  }
}
