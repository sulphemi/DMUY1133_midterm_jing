let fog;
let lightSources = [];

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    fog.noFill();
    fog.strokeWeight(1);
    lightSources.push({x: 400, y: 400, str: 300});
}

function draw() {
    blendMode(BLEND);
    background(255);

    if (frameCount % 3 == 0) {
        //this is an expensive operation, do this every 3rd frame
        fog.background(0); //set to black
        for (const light of lightSources) {
            //graded white circle at each light source
            for (let i = 0; i < light.str; i++) {
                fog.stroke(255 - i);
                fog.circle(light.x, light.y, i);
            }
        }
    }

    blendMode(MULTIPLY);
    image(fog, 0, 0);
    console.log(frameRate());
}