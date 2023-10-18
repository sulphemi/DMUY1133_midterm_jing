let fog;
let lightSources = [];

const GRADIENT_STEP = 6;

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    fog.noFill();
    //fog.strokeWeight(GRADIENT_STEP);
    fog.noStroke();
    lightSources.push({x: 400, y: 400, str: 300});
}

function draw() {
    if (lightSources.length > 1) lightSources.pop();
    lightSources.push({x: mouseX, y: mouseY, str: 400});

    blendMode(BLEND);
    background(255);


    fog.background(0); //set to black
    for (const light of lightSources) {
        //graded white circle at each light source
        for (let i = 0; i < light.str; i += GRADIENT_STEP) {
            fog.fill(255, 255 - i);
            fog.circle(light.x, light.y, i);
        }
    }

    blendMode(MULTIPLY);
    image(fog, 0, 0);
    console.log(frameRate());
}