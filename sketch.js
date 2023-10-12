class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xVel = random(-1, 1);
        this.yVel = random(-1, 1);
        this.theta = random(0, TWO_PI);
        this.omega = random(-0.05, 0.05);
        this.w = 25;
    }

    tick() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.theta += this.omega;
    }

    display() {
        fill(50, 120, 255, 120);
        push();

        translate(this.x, this.y);
        rotate(this.theta);

        square(0, 0, this.w);

        pop();
    }
}

const squareList = [];
setup = () => {
    rectMode(RADIUS);
    createCanvas(windowWidth, windowHeight);
    noStroke();
    
    for (let i = 0; i < 100; i++) squareList.push(new Square(random(0, width), random(0, height)));
}

draw = () => {
    background(240);
    for (const sq of squareList) {
        sq.tick();
        sq.display();
    }
}