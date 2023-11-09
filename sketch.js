let fog;

const GRADIENT_STEP = 7;

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    prepFogLayer(300);

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

    drawFogLayer(mouseX, mouseY);

    console.log(frameRate());
}

function prepFogLayer(r) {
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
}

function drawFogLayer(x, y) {
    blendMode(MULTIPLY);
    image(fog, x - fog.width / 2, y - fog.height / 2);
    blendMode(BLEND); //reset blend mode
}