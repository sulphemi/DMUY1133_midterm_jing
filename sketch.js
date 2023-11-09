let fog;

function setup() {
    createCanvas(800, 800);
    fog = prepFogLayer(300);

    noCursor();
    img = loadImage("./witch.jpg");
}

function draw() {
    background(255);
    image(img, -100, -100);

    //circle to represent cursor
    fill("#4080ff");
    noStroke();
    circle(mouseX, mouseY, 10);

    drawFogLayer(fog, mouseX, mouseY);

    console.log(frameRate());
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