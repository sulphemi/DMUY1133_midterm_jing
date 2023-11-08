let fog;
let lightSources = [];

const GRADIENT_STEP = 7;

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    lightSources.push({x: 400, y: 400, str: 200});

    noCursor();
    img = loadImage("./witch.jpg");
}

function draw() {
    if (lightSources.length > 1) lightSources.pop();
    lightSources.push({x: mouseX, y: mouseY, str: 150});

    background(255);
    image(img, -100, -100);

    //circle to represent cursor
    fill("#4080ff");
    noStroke();
    circle(mouseX, mouseY, 10);

    //resource-intensive so we only update every few frames
    if (frameCount % 3 === 0) prepFogLayer();
    drawFogLayer();

    console.log(frameRate());
}

function prepFogLayer() {
    fog.background(0); //set to black

    for (const light of lightSources) {
        //graded white circle at each light source

        //circlular viewing field
        fog.noStroke();
        fog.fill(255);
        fog.circle(light.x, light.y, light.str);

        //vignette
        fog.noFill();
        fog.strokeWeight(GRADIENT_STEP);
        for (let i = 0; i < 255; i += GRADIENT_STEP) {
            fog.stroke(255, 255 - i);
            fog.circle(light.x, light.y, light.str + i);
        }
    }
}

function drawFogLayer() {
    blendMode(MULTIPLY);
    image(fog, 0, 0);
    blendMode(BLEND); //reset blend mode
}