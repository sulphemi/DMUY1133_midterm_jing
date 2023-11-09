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
        //the amount offscreen that squares may go before being confined
        let DEMILITARIZED_ZONE = AVOIDANCE_DIST + 50;

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

    inbounds() {
        return this.x > 0 && this.x < width && this.y > 0 && this.y < height;
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

    //update cursorSquare
    cursorSquare.x = mouseX;
    cursorSquare.y = mouseY;
    cursorSquare.theta += cursorSquare.omega;
    cursorSquare.display();

    //check if there are still any squares left on screen
    let squaresStillOnscreen = false;
    for (const sq of squareList) {
        if (sq.inbounds()) {
            squaresStillOnscreen = true;
            break; //no need to keep looking
        }
    }

    if (! squaresStillOnscreen) {
        //switch to transition scene

        //disable event listeners
        mouseWheel = keyPressed = pass;

        //replace draw function
        draw = draw_transitionScene;
        transitionTickCounter = 0;

        //start precalculating fog filters
        fogPromise = prepareFogFilter;
    }
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
}

let transitionTickCounter;
draw_transitionScene = () => {
    const TRANSITION_FRAME_CT = 360;

    //gradually darken background
    background(map(transitionTickCounter, 0, TRANSITION_FRAME_CT, 255, 0));

    //color of cursorSquare transitions to pure white
    cursorSquare.c = color(
        map(transitionTickCounter, 0, TRANSITION_FRAME_CT, 50, 255),
        map(transitionTickCounter, 0, TRANSITION_FRAME_CT, 120, 255),
        map(transitionTickCounter, 0, TRANSITION_FRAME_CT, 255, 255), //c'est unnecessaire
        map(transitionTickCounter, 0, TRANSITION_FRAME_CT, 120, 255)
    );

    //continue ticking cursor square
    cursorSquare.x = mouseX;
    cursorSquare.y = mouseY;
    cursorSquare.theta += cursorSquare.omega;
    cursorSquare.display();

    if (transitionTickCounter++ > TRANSITION_FRAME_CT) {
        //move to scene 2
    }
}

let fogPromise;
let fogFilters;
async function prepareFogFilter() {
    fogFilters = [];
}

//prepares a fog layer with radius r viewing window, returning it as a pgraphics
function prepFogLayer(r) {
    const GRADIENT_STEP = 5;
    let fog = createGraphics(r * 2, r * 2);

    fog.background(0); //set to black

    //circular viewing window
    fog.noStroke();
    fog.fill(255);
    fog.circle(fog.width / 2, fog.height / 2, r);

    //vignette
    fog.noFill();
    fog.strokeWeight(GRADIENT_STEP);
    for (let i = 0; i < 255; i += GRADIENT_STEP) {
        fog.stroke(255, 255 - i);
        fog.circle(fog.width / 2, fog.height / 2, r + i);
    }

    return fog;
}

//draws fog with viewing window centered at (x, y)
function drawFogLayer(fog, x, y) {
    blendMode(MULTIPLY);
    image(fog, x - fog.width / 2, y - fog.height / 2);
    blendMode(BLEND); //reset blend mode

    rectMode(CORNERS); //makes it easier zzz
    //draw rectangles to compensate for uncovered edges
    fill(0);
    rect(0, 0, x - fog.width / 2, height); //left
    rect(x - fog.width / 2, 0, x + fog.width / 2, y - fog.height / 2); // top
    rect(x - fog.width / 2, height, x + fog.width / 2, y + fog.height / 2); // bottom
    rect(x + fog.width / 2, 0, width, height); //right
}