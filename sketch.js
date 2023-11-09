let AVOIDANCE_DIST = 150;

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
        let DEMILITARIZED_ZONE = AVOIDANCE_DIST + 50; //the amount offscreen that squares may go before being confined

        //if out of bounds, teleport to bound and correct sign of velocity
        if (this.x < -DEMILITARIZED_ZONE) {
            this.x = -DEMILITARIZED_ZONE;
            this.xVel = Math.abs(this.xVel);
        }
        if (this.x > width + DEMILITARIZED_ZONE) {
            this.x = width + DEMILITARIZED_ZONE;
            this.xVel = -Math.abs(this.xVel);
        }
        if (this.y < -DEMILITARIZED_ZONE) {
            this.y = -DEMILITARIZED_ZONE;
            this.yVel = Math.abs(this.yVel);
        }
        if (this.y > height + DEMILITARIZED_ZONE) {
            this.y = height + DEMILITARIZED_ZONE;
            this.yVel = -Math.abs(this.yVel);
        }
    }

    avoidance() {
        const NEUTRAL_MAX_VEL = 1;
        const NEUTRAL_DAMPENER = 0.5;

        const DEFAULT_BLUE = color(50, 120, 255, 120);
        const SCARED_RED = color(255, 0, 0, 120);
        
        if (dist(this.x, this.y, mouseX, mouseY) < AVOIDANCE_DIST) {
            this.c = lerpColor(DEFAULT_BLUE, SCARED_RED, (AVOIDANCE_DIST - dist(this.x, this.y, mouseX, mouseY)) / AVOIDANCE_DIST);

            this.xVel += (AVOIDANCE_DIST - (this.x - mouseX)) / 250 * (mouseX > this.x ? -1 : 1);
            this.yVel += (AVOIDANCE_DIST - (this.y - mouseY)) / 250 * (mouseY > this.y ? -1 : 1);
        } else {
            this.c = DEFAULT_BLUE;
            if (this.xVel > NEUTRAL_MAX_VEL) this.xVel -= NEUTRAL_DAMPENER;
            if (this.yVel > NEUTRAL_MAX_VEL) this.yVel -= NEUTRAL_DAMPENER;
            if (this.xVel < -NEUTRAL_MAX_VEL) this.xVel += NEUTRAL_DAMPENER;
            if (this.yVel < -NEUTRAL_MAX_VEL) this.yVel += NEUTRAL_DAMPENER;
        }
    }
}

let cursorSquare;
const squareList = [];
setup = () => {
    rectMode(RADIUS);
    createCanvas(windowWidth, windowHeight);
    noStroke();
    
    const squareCount = width / 5;
    for (let i = 0; i < squareCount; i++) squareList.push(new Square(random(0, width), random(0, height)));
    cursorSquare = new Square(width / 2, height / 2);
}

draw = () => {
    background(240);
    for (const sq of squareList) {
        sq.tick();
        sq.display();
    }

    cursorSquare.x = mouseX;
    cursorSquare.y = mouseY;
    cursorSquare.theta += cursorSquare.omega;
    cursorSquare.display();
}

//mouse wheel increases/decreases radius of effect
mouseWheel = event => {
    changeAvoidDist(event.delta);
}

//same with up/down keys
keyPressed = () => {
    switch (key) {
        case "ArrowUp":
            changeAvoidDist(10);
            break;
        case "ArrowDown":
            changeAvoidDist(-10);
            break;
        default:
            break;
    }
}

pass = () => {}

changeAvoidDist = factor => {
    AVOIDANCE_DIST += factor;
    if (AVOIDANCE_DIST < 0) AVOIDANCE_DIST = 0;
    if (AVOIDANCE_DIST < 150) {
        cursorSquare.c = color(50, 120, 255, map(AVOIDANCE_DIST, 0, 150, 0, 120));
    } else {
        cursorSquare.c = color(50, 120, 255, 120);
    }

    if (AVOIDANCE_DIST > width / 2) {
        //switch to transition mode

        //disable event listeners
        mouseWheel = keyPressed = pass;

        //replace draw function
        draw = draw_transitionScene;
        transitionTickCounter = 0;

        //start precalculating fog filters
        fogPromise = prepareFogFilter;
    }
}

let transitionTickCounter;
draw_transitionScene = () => {
    if (transitionTickCounter++ > 180) {
        //move to scene 2
    }
}

let fogPromise;
let fogFilters;
async function prepareFogFilter() {
    fogFilters = [];
}