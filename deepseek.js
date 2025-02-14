let balls = [];
let numBalls = 100;
let sphereRadius = 200;
let trailLength = 50;

function setup() {
  createCanvas(600, 600, WEBGL);
  for (let i = 0; i < numBalls; i++) {
    balls.push(new Ball());
  }
}

function draw() {
  background(30);
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);
  noFill();
  stroke(255);
  strokeWeight(2);
  sphere(sphereRadius);

  for (let ball of balls) {
    ball.update();
    ball.show();
  }
}

class Ball {
  constructor() {
    this.pos = p5.Vector.random3D().mult(sphereRadius * 0.8);
    this.vel = p5.Vector.random3D().mult(2);
    this.trail = [];
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.pos.add(this.vel);

    if (this.pos.mag() > sphereRadius) {
      let normal = this.pos.copy().normalize();
      let reflection = this.vel.copy().reflect(normal);
      this.vel.set(reflection);
      this.pos.set(normal.mult(sphereRadius * 0.99));
    }

    this.trail.push(this.pos.copy());
    if (this.trail.length > trailLength) {
      this.trail.splice(0, 1);
    }
  }

  show() {
    noStroke();
    fill(this.color);
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(5);
    pop();

    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 255);
      stroke(this.color, alpha);
      strokeWeight(2);
      if (i > 0) {
        line(
          this.trail[i].x, this.trail[i].y, this.trail[i].z,
          this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i - 1].z
        );
      }
    }
  }
}