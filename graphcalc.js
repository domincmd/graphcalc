const canvasWidth = 600;
const canvasHeight = 600;
const pointCheckInterval = 1;

let expressions = [
  ["Math.sin(x)*10", [Math.random() * 150, Math.random() * 150, Math.random() * 150]]
];

const movementSpeed = 5;

let zoom = 0.1;
const calculateTimes = 100;

let viewX = canvasWidth / 2;
let viewY = canvasHeight / 2;

const pointSize = 8;

function createBackgroundLines() {
  strokeWeight(1);
  const step = Math.max(0.01, Math.round((pointCheckInterval / zoom) * 100) / 100); // Avoid zero or negative step
  const startX = Math.floor(-viewX / step) * step;
  const startY = Math.floor(-viewY / step) * step;

  for (let x = startX; x < canvasWidth - viewX; x += step) {
    stroke(Math.round(x*10)/10 % 100 === 0 ? 130 : 200); // Change stroke color for major lines
    line(viewX + x, 0, viewX + x, canvasHeight);
  }
  for (let y = startY; y < canvasHeight - viewY; y += step) {
    stroke(Math.round(y*10)/10 % 100 === 0 ? 130 : 200); // Change stroke color for major lines
    line(0, viewY + y, canvasWidth, viewY + y);
  }

  // Axes
  stroke(0);
  strokeWeight(2);
  line(0, viewY, canvasWidth, viewY); // Horizontal line
  line(viewX, 0, viewX, canvasHeight); // Vertical line
}

function transformPointsTo(x, y) {
  return [viewX + x, viewY - y];
}

function drawPoints(graphExpression, r, g, b) {
  stroke(r, g, b);
  const points = [];
  for (let x = (1 - calculateTimes / 2) * pointCheckInterval; x < calculateTimes / 2 * pointCheckInterval; x += pointCheckInterval) {
    const y = eval(graphExpression) / zoom;
    points.push(createVector(x / zoom, y));
    const [absoluteX, absoluteY] = transformPointsTo(x / zoom, y);
    ellipse(absoluteX, absoluteY, pointSize, pointSize);
  }
  return points;
}

function drawLines(points, r, g, b) {
  stroke(r, g, b);
  for (let i = 0; i < points.length - 1; i++) {
    const { x: currentX, y: currentY } = points[i];
    const { x: nextX, y: nextY } = points[i + 1];
    const [currentAbsoluteX, currentAbsoluteY] = transformPointsTo(currentX, currentY);
    const [nextAbsoluteX, nextAbsoluteY] = transformPointsTo(nextX, nextY);
    line(currentAbsoluteX, currentAbsoluteY, nextAbsoluteX, nextAbsoluteY);
  }
}

function drawGraph() {
  console.clear();
  createCanvas(canvasWidth, canvasHeight);
  background(220);
  createBackgroundLines();

  expressions.forEach(i => {
    const points = drawPoints(i[0], i[1][0], i[1][1], i[1][2]);
    drawLines(points, i[1][0], i[1][1], i[1][2]);
  });
}

function setup() {
  drawGraph();
}

function draw() {
  let moved = false;
  if (keyIsDown(87)) { // 'W' key
    viewY += movementSpeed;
    moved = true;
  }
  if (keyIsDown(65)) { // 'A' key
    viewX += movementSpeed;
    moved = true;
  }
  if (keyIsDown(83)) { // 'S' key
    viewY -= movementSpeed;
    moved = true;
  }
  if (keyIsDown(68)) { // 'D' key
    viewX -= movementSpeed;
    moved = true;
  }

  if (moved) {
    drawGraph();
  }
}

function keyPressed() {
  if (key === "ArrowDown") {
    if (zoom >= 1) {
      zoom += 1;
    } else if (zoom > 0.1) {
      zoom += 0.1;
    } else {
      zoom += 0.01;
    }
    zoom = Math.round(zoom * 100) / 100;
    drawGraph();
  } else if (key === "ArrowUp") {
    if (zoom > 1) {
      zoom -= 1;
    } else if (zoom > 0.1) {
      zoom -= 0.1;
    } else if (zoom > 0.01) {
      zoom -= 0.01;
    }
    zoom = Math.max(0.01, Math.round(zoom * 100) / 100); // Avoid negative zoom
    drawGraph();
  }
}
