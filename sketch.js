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
        this.bounceOnEdge();
        this.x += this.xVel;
        this.y += this.yVel;
        this.theta += this.omega;
        this.avoidance();
    }

    display() {
        fill(50, 120, 255, 120);
        push();

        translate(this.x, this.y);
        rotate(this.theta);

        square(0, 0, this.w);

        pop();
    }

    bounceOnEdge() {
        if (this.x < 0 || this.x > width) this.xVel = -this.xVel
        if (this.y < 0 || this.y > height) this.yVel = -this.yVel;
    }

    wrapOnEdge() {
        //to be implemented
    }

    avoidance() {
        const AVOIDANCE_DIST = 30;

        if (this.x - mouseX > 0 && this.x - mouseX < AVOIDANCE_DIST) {
            this.xVel += 1;
        }

        if (this.x - mouseX < 0 && this.x - mouseX > -AVOIDANCE_DIST) {
            this.xVel -= 1;
        }

        if (this.y - mouseY > 0 && this.y - mouseY < AVOIDANCE_DIST) {
            this.yVel += 1;
        }

        if (this.y - mouseY < 0 && this.y - mouseY > -AVOIDANCE_DIST) {
            this.yVel -= 1;
        }
    }
}

const squareList = [];
setup = () => {
    rectMode(RADIUS);
    createCanvas(windowWidth, windowHeight);
    noStroke();
    
    for (let i = 0; i < 200; i++) squareList.push(new Square(random(0, width), random(0, height)));
}

draw = () => {
    background(240);
    for (const sq of squareList) {
        sq.tick();
        sq.display();
    }
}