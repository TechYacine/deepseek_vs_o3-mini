let balls = [];
const numBalls = 100;
const containerRadius = 300;
const ballRadius = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Initialize balls with random positions and velocities inside the sphere
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the entire scene (container and balls)
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.005);
  
  // Draw the container sphere as a wireframe so you can see inside
  noFill();
  stroke(255, 100);
  sphere(containerRadius);
  
  // Update and display each ball and its trail
  for (let ball of balls) {
    ball.update();
    ball.display();
  }
}

class Ball {
  constructor() {
    // Start with a random position inside the container sphere
    this.pos = p5.Vector.random3D().mult(random(containerRadius - ballRadius));
    // Give the ball a random velocity (direction and speed)
    this.vel = p5.Vector.random3D().mult(random(1, 3));
    // Random vibrant color for the ball and its trail
    this.col = color(random(50, 255), random(50, 255), random(50, 255));
    // Trail stores the most recent positions (for a fading path effect)
    this.trail = [];
    this.maxTrail = 25; // maximum number of points in the trail
  }
  
  update() {
    // Update position using the velocity
    this.pos.add(this.vel);
    
    // Save a copy of the current position in the trail array
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrail) {
      this.trail.shift(); // Remove the oldest position to keep the trail length fixed
    }
    
    // Collision detection: if the ball is about to exit the sphere, bounce it back
    let distFromCenter = this.pos.mag();
    if (distFromCenter + ballRadius > containerRadius) {
      // Calculate the surface normal at the collision point
      let normal = this.pos.copy().normalize();
      // Reflect the velocity: v' = v - 2*(v·n)*n
      let dot = this.vel.dot(normal);
      this.vel.sub(p5.Vector.mult(normal, 2 * dot));
      
      // Reposition the ball so it stays inside the sphere
      this.pos = normal.mult(containerRadius - ballRadius);
    }
  }
  
  display() {
    // Draw the fading trail by connecting consecutive points
    noFill();
    for (let i = 0; i < this.trail.length - 1; i++) {
      // Map the trail index to an alpha value so older segments are more transparent
      let alpha = map(i, 0, this.trail.length - 1, 50, 255);
      stroke(red(this.col), green(this.col), blue(this.col), alpha);
      line(
        this.trail[i].x, this.trail[i].y, this.trail[i].z,
        this.trail[i + 1].x, this.trail[i + 1].y, this.trail[i + 1].z
      );
    }
    
    // Draw the ball as a small sphere
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.col);
    sphere(ballRadius);
    pop();
  }
}
