class Bird {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.v = 0;
    this.velocitydir = 1;
  }

  draw = () => {
    fill(255, 1, 1);
    strokeWeight(0);
    circle(this.x, this.y, this.size);
  };
  update = () => {
    this.y += this.v * this.velocitydir;
  };
}
