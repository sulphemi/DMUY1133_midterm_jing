class Square {
    constructor() {
        this.x = 100;
        this.y = 100;
        this.xVel = 1;
        this.yVel = 1;
        this.theta = 0;
        this.omega = 0.05;
        this.w = 25;
    }

    tick() {
        this.x += this.xVel;
        this.y += this.yVel;
        this.theta += this.omega;
    }

    display() {
        fill(50, 120, 255);
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
    squareList.push(new Square());
}

draw = () => {
    background(240);
    for (const sq of squareList) {
        sq.tick();
        sq.display();
    }
}