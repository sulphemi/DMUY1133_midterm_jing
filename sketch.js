class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xVel = random(-1, 1);
        this.yVel = random(-1, 1);
        this.theta = random(0, TWO_PI);
        this.omega = random(-0.05, 0.05);
        this.w = 25;
        this.c = color(50, 120, 255, 120);
    }

    tick() {
        this.bounceOnEdge();
        this.x += this.xVel;
        this.y += this.yVel;
        this.theta += this.omega;
        this.avoidance();
    }

    display() {
        fill(this.c);
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
        const NEUTRAL_MAX_VEL = 1;
        const AVOIDANCE_DIST = 150;
        const NEUTRAL_DAMPENER = 0.5;
        
        if (dist(this.x, this.y, mouseX, mouseY) < AVOIDANCE_DIST) {
            this.c = color(255, 0, 0, 120);
            /*
            this.x += (200 - (this.x - mouseX)) / 100 * (mouseX > this.x ? -1 : 1);
            this.y += (200 - (this.y - mouseY)) / 100 * (mouseY > this.y ? -1 : 1);
            */

            this.xVel += (AVOIDANCE_DIST - (this.x - mouseX)) / 250 * (mouseX > this.x ? -1 : 1);
            this.yVel += (AVOIDANCE_DIST - (this.y - mouseY)) / 250 * (mouseY > this.y ? -1 : 1);
        } else {
            this.c = color(50, 120, 255, 120);
            if (this.xVel > NEUTRAL_MAX_VEL) this.xVel -= NEUTRAL_DAMPENER;
            if (this.yVel > NEUTRAL_MAX_VEL) this.yVel -= NEUTRAL_DAMPENER;
            if (this.xVel < -NEUTRAL_MAX_VEL) this.xVel += NEUTRAL_DAMPENER;
            if (this.yVel < -NEUTRAL_MAX_VEL) this.yVel += NEUTRAL_DAMPENER;
        }

        /*


        if (dist(this.x, mouseX, this.y, mouseY) < AVOIDANCE_DIST) {
            this.xVel = 
            this.yVel = 
        } else {
            if (this.xVel > NEUTRAL_MAX_VEL) this.xVel -= 0.1;
            if (this.yVel > NEUTRAL_MAX_VEL) this.yVel -= 0.1;
            if (this.xVel < -NEUTRAL_MAX_VEL) this.xVel += 0.1;
            if (this.yVel < -NEUTRAL_MAX_VEL) this.yVel += 0.1;
        }
        */
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