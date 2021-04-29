class Pipe {
  constructor(x, y1, y2, width, passed) {
    this.x = x;
    this.y1 = y1;
    this.y2 = y2;
    this.width = width;
    this.passed = passed;
    this.a = this.x - 20;
    this.b = this.y2;
    this.c = this.x + this.width + 20;
    this.d = this.y2 + 45;
  }
  update = () => {
    this.x -= pipespeed;
  };

  pipextra = () => {
    (this.a = this.x - 20),
      (this.b = this.y2),
      (this.c = this.x + this.width + 20),
      (this.d = this.y2 + 45);
    return a, b, c, d;
  };

  draw = () => {
    fill(1, 255, 1);
    stroke(1, 255, 1);
    rect(this.x, 0, this.x + this.width, this.y1);
    rect(this.x, this.y2, this.x + this.width, dimy);
  };
}
