const canvasWidth = 600;
const canvasHeight = 600;
const pointCheckInterval = 1;

let expressions = [
  ["factorial(x)", [Math.random() * 150, Math.random() * 150, Math.random() * 150]] // Missing comma fixed here
];

const movementSpeed = 5;

let zoom = 0.1;

const calculateTimes = 100;

let viewX = canvasWidth/2;
let viewY = canvasHeight/2;

const pointSize = 8

function createBackgroundLines() {
  
  
  
  if (zoom > 6) {
    stroke(0)
    stroke(100);
    line(0, viewY, canvasWidth, viewY); // Horizontal line
    line(viewX, 0, viewX, canvasHeight); // Vertical line
    console.warn("disabled stripes cuz its gettin too laggy")
    return
  }

  stroke(200);
  strokeWeight(1);

  const step = Math.round((pointCheckInterval / zoom) * 100)/100;
  const startX = Math.floor(-viewX / step) * step;
  const startY = Math.floor(-viewY / step) * step;

  for (let x = startX; x < canvasWidth - viewX; x += step) {
    line(viewX + x, 0, viewX + x, canvasHeight);
    //console.log(zoom*100%x)
    console.log(x)
  }
  for (let y = startY; y < canvasHeight - viewY; y += step) {
    line(0, viewY + y, canvasWidth, viewY + y);
  }
  stroke(0);
  strokeWeight(2);
  line(0, viewY, canvasWidth, viewY); // Horizontal line
  line(viewX, 0, viewX, canvasHeight); // Vertical line
  strokeWeight(1);
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

    //console.log("X: " + x/zoom + " Y: " + y)

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
  expressions.forEach(i => {
    let points = drawPoints(i[0], i[1][0], i[1][1], i[1][2]);
    drawLines(points, i[1][0], i[1][1], i[1][2]);
  })
}

function setup() {
  drawGraph()
}

function draw() {
  let moved = false;

  if (keyIsDown(87)) { // 'W' key
    viewY += movementSpeed;
    moved = true
  }
  if (keyIsDown(65)) { // 'A' key
    viewX += movementSpeed;
    moved = true
  }
  if (keyIsDown(83)) { // 'S' key
    viewY -= movementSpeed;
    moved = true
  }
  if (keyIsDown(68)) { // 'D' key
    viewX -= movementSpeed;
    moved = true
  }

  if (moved) {
    drawGraph();
  }
}

function keyPressed() {
  if (key === "ArrowDown") {
    if (zoom >= 1) {
      zoom += 1;
    } else if (zoom > 0.2) {
      zoom += 0.2;
    }else if (zoom > 0) {
      zoom += 0.05;
    }
    zoom = Math.round(zoom*100)/100

    drawGraph();
  } else if (key === "ArrowUp") {
    if (zoom > 1) {
      zoom -= 1;
    } else if (zoom > 0.2) {
      zoom -= 0.2;
    }else if (zoom > 0.05) {
      zoom -= 0.05;
    }
    zoom = Math.round(zoom*100)/100

    drawGraph();
  }
}

