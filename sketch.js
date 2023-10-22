let fog;
let lightSources = [];

const GRADIENT_STEP = 5;

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    lightSources.push({x: 400, y: 400, str: 200});

    img = loadImage("https://localhost");
}

function draw() {
    if (lightSources.length > 1) lightSources.pop();
    lightSources.push({x: mouseX, y: mouseY, str: 150});

    blendMode(BLEND);
    background(255);
    image(img, -100, -100);

    //fog.blendMode(BLEND);
    fog.background(0); //set to black
    //fog.blendMode(SCREEN);

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

    blendMode(MULTIPLY);
    image(fog, 0, 0);
    console.log(frameRate());
}