let scl = 20;
let canvasWidth = 800;
let canvasHeight = 500;
let s;
let food;
let cols, rows;
let eatSound, gameOverSound, bgMusic;
let score = 0;
let canvas;

function preload() {
  eatSound = loadSound("crunch.wav");
  gameOverSound = loadSound("spongbobgameover.mp3");
  bgMusic = loadSound("gameloop.wav");
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("container");
  canvas.elt.style.width = "700px";
  canvas.elt.style.height = "525px";

  frameRate(10);
  colorMode(HSB, 255);
  noStroke();

  cols = floor(width / scl);
  rows = floor(height / scl);

  s = new Snake();
  pickLocation();

  bgMusic.stop();
  bgMusic.setVolume(0.5);
  bgMusic.loop();
  score = 0;
}

function windowResized() {
  // Prevent resizing — keep fixed size
}

function pickLocation() {
  const x = floor(random(cols)) * scl;
  const y = floor(random(rows)) * scl;
  food = createVector(x, y);
}

function draw() {
  background(30);

  if (s.eat(food)) {
    eatSound.play();
    pickLocation();
    score++;
  }

  s.death();
  s.update();
  s.show();

  // Draw food
  fill(0, 255, 255);
  rect(food.x, food.y, scl, scl, 5);

  // Draw score
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
}

function keyPressed() {
  if (keyCode === UP_ARROW && s.yspeed !== 1) s.dir(0, -1);
  else if (keyCode === DOWN_ARROW && s.yspeed !== -1) s.dir(0, 1);
  else if (keyCode === LEFT_ARROW && s.xspeed !== 1) s.dir(-1, 0);
  else if (keyCode === RIGHT_ARROW && s.xspeed !== -1) s.dir(1, 0);
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 2;
  this.tail = [createVector(-scl, 0)];

  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.eat = function (pos) {
    if (dist(this.x, this.y, pos.x, pos.y) < 1) {
      this.total++;
      return true;
    }
    return false;
  };

  this.death = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (dist(this.x, this.y, this.tail[i].x, this.tail[i].y) < 1) {
        gameOverSound.play();
        alert("Game Over! Your score: " + score);
        bgMusic.stop();
        setup();
        return;
      }
    }
  };

  this.update = function () {
    this.tail.push(createVector(this.x, this.y));
    while (this.tail.length > this.total) this.tail.shift();

    this.x += this.xspeed * scl;
    this.y += this.yspeed * scl;

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  };

  this.show = function () {
    fill(120, 255, 255);
    for (let i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl, 5);
    }
    fill(60, 255, 255); // Head is a different color
    rect(this.x, this.y, scl, scl, 5);
  };
}
