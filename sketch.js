const dimx = screen.width;
const dimy = screen.height - 150;
const holeoffset = 60;
const birdsize = 60;
const holesize = 200;
const g = 8;
const timeratio = 13;
const pipespeed = 3; //                                            VARIJABLE
const pipespacing = 100 * pipespeed;
const pipewidth = 100;
const boostvelocity = 10;
let pipes = [];
let path = 0;
let removal = [];
let frozen = false;
let score = 0;

//Učitavanje slika i postavljanje "postavki programiranja"///////////////////////////////////////////////////////////////////////////////////////////
function preload() {
  birdimg = loadImage("assets/bird.png");
  pipeimg = loadImage("assets/pipe.png");
  skyline = loadImage("assets/skyline.jpg");
  pipeimgheight = pipeimg.height;
}

function setup() {
  createCanvas(dimx, dimy);
  rectMode(CORNERS);
  imageMode(CORNERS);
  resetString = "PRESS ENTER TO RESTART";
}

bird = new Bird(dimx * 0.2, dimy / 2, birdsize);

function draw() {
  // COLISION CHECKS ///////////////////////////////////////////////////////////////////////////////////////////
  if (bird.y + bird.size / 2 > dimy - 20 || bird.y - bird.size / 2 < 0) {
    frozen = true;
  }
  for (let i = 0; i < pipes.length; i++) {
    if ((pipes[i].passed === false) & (pipes[i].x + pipewidth < bird.x)) {
      pipes[i].passed = true;
      score += 1;
    }
    if (
      actualcolide(bird, pipes[i]) ||
      colide(
        bird,
        pipes[i].x - dimx * 0.005,
        pipes[i].y1 - dimy * 0.03,
        pipes[i].x + pipes[i].width + dimx * 0.005,
        pipes[i].y1
      ) ||
      colide(
        bird,
        pipes[i].x - dimx * 0.005,
        pipes[i].y2,
        pipes[i].x + pipes[i].width + dimx * 0.005,
        pipes[i].y2 + dimy * 0.03
      )
    ) {
      frozen = true;
    }
  }

  //TEXT RESET ///////////////////////////////////////////////////////////////////////////////////////////
  if (frozen) {
    textSize(dimx * 0.067);
    textAlign(CENTER, CENTER);
    fill("#910000");
    stroke("#910000");
    text(resetString, dimx / 2, dimy / 2);
  }

  if (!frozen) {
    background(52, 195, 235);
    image(skyline, 0, 0, dimx, dimy);
    fill("#065424");
    stroke("#065424");
    rect(dimx, dimy - 20, 0, dimy);

    // BIRD LOGIC///////////////////////////////////////////////////////////////////////////////////////////
    bird.update();
    //bird draw///////////////////////////////////////////////////////////////////////////////////////////
    image(
      birdimg,
      bird.x - birdsize / 2,
      bird.y - birdsize / 2,
      bird.x + birdsize / 2,
      bird.y + birdsize / 2
    );

    bird.v += (bird.velocitydir * g) / timeratio;
    if (bird.v === 0) {
      bird.velocitydir *= -1;
    }
    // PIPE UPDATE ///////////////////////////////////////////////////////////////////////////////////////////
    if (path % pipespacing === 0) {
      randy1 = holeoffset + Math.random() * (dimy - holeoffset * 2 - holesize);
      console.log(randy1);
      randy2 = randy1 + holesize;
      pipes.push(new Pipe(dimx, randy1, randy2, pipewidth, false));
    }
    removal = [];
    for (let i = 0; i < pipes.length; i++) {
      //draw pipe ///////////////////////////////////////////////////////////////////////////////////////////

      obj = pipes[i];
      pipes[i].update();
      if (pipes[i].x <= 0 - pipes[i].width) {
        removal.push(i);
      } else {
        image(pipeimg, obj.x, 0, obj.x + obj.width, obj.y1);
        image(pipeimg, obj.x, obj.y2, obj.x + obj.width, dimy);
        stroke("#508f00");
        fill("#508f00");

        rect(
          pipes[i].x - dimx * 0.005,
          pipes[i].y1 - dimy * 0.03,
          pipes[i].x + pipes[i].width + dimx * 0.005,
          pipes[i].y1
        );
        rect(
          pipes[i].x - dimx * 0.005,
          pipes[i].y2,
          pipes[i].x + pipes[i].width + dimx * 0.005,
          pipes[i].y2 + dimy * 0.03
        );
      }
    }
    for (let i = removal.length - 1; i > -1; i--) {
      pipes.splice(removal[i], 1);
    }

    path += pipespeed;
  }
  //SCORE ///////////////////////////////////////////////////////////////////////////////////////////
  textSize(dimx * 0.09);
  textAlign(CENTER, CENTER);
  textAlign(TOP);
  stroke("#065424");
  fill("#065424");
  text(str(score), dimx / 2, dimy * 0.1);
}

function keyPressed() {
  if (!frozen) {
    if (keyCode === 13) {
      bird.v = boostvelocity;
      bird.velocitydir = -1;
    }
  }
  if (frozen) {
    if (keyCode === 13) {
      resetall();
    }
  }
}

function resetall() {
  console.log("IM PRESSED");
  frozen = false;
  bird.y = dimy / 2;
  bird.v = 0;
  pipes = [];
  score = 0;
}

function actualcolide(bird, pipe) {
  krug = bird;
  x1 = pipe.x;
  x2 = pipe.x + pipe.width;
  y1 = 0;
  y2 = pipe.y1;
  why1 = pipe.y2;
  why2 = dimy;
  return colide(krug, x1, y1, x2, y2) || colide(krug, x1, why1, x2, why2);
}

function colide(krug, x1, y1, x2, y2) {
  let q = krug.y;
  let p = krug.x;
  let r = krug.size / 2;
  let colision = false;

  col1 = r * r - Math.pow(x1 - p, 2); //Q
  col2 = r * r - Math.pow(x2 - p, 2); //Q
  col3 = r * r - Math.pow(y1 - q, 2); //P
  col4 = r * r - Math.pow(y2 - q, 2); //P

  if (col1 >= 0) {
    colx = x1;
    coly1 = Math.sqrt(col1) + q;
    coly2 = -1 * Math.sqrt(col1) + q;
    if (!(coly1 >= y1 && coly1 <= y2)) {
      coly1 = undefined;
    } else {
      colision = true;
    }
    if (!(coly2 >= y1 && coly2 <= y2)) {
      coly2 = undefined;
    } else {
      colision = true;
    }
  }
  if (col2 >= 0) {
    colx = x2;
    coly1 = Math.sqrt(col2) + q;
    coly2 = -1 * Math.sqrt(col2) + q;
    if (!(coly1 >= y1 && coly1 <= y2)) {
      coly1 = undefined;
    } else {
      colision = true;
    }
    if (!(coly2 >= y1 && coly2 <= y2)) {
      coly2 = undefined;
    } else {
      colision = true;
    }
  }
  if (col3 >= 0) {
    coly = y1;
    colx1 = Math.sqrt(col3) + p;
    colx2 = -1 * Math.sqrt(col3) + p;

    if (!(colx1 >= x1 && colx1 <= x2)) {
      colx1 = undefined;
    } else {
      colision = true;
    }
    if (!(colx2 >= x1 && colx2 <= x2)) {
      colx2 = undefined;
    } else {
      colision = true;
    }
  }
  if (col4 >= 0) {
    coly = y2;
    colx1 = Math.sqrt(col4) + p;
    colx2 = -1 * Math.sqrt(col4) + p;
    if (!(colx1 >= x1 && colx1 <= x2)) {
      colx1 = undefined;
    } else {
      colision = true;
    }
    if (!(colx2 >= x1 && colx2 <= x2)) {
      colx2 = undefined;
    } else {
      colision = true;
    }
  }

  if (p >= x1 + r && p <= x2 - r && q >= y1 + r && q <= y2 - r) {
    colision = true;
  }
  return colision;
}
