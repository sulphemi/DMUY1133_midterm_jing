let fog;
let lightSources = [];

function setup() {
    createCanvas(800, 800);
    fog = createGraphics(width, height);
    fog.blendMode(MULTIPLY);
    fog.noFill();
    fog.strokeWeight(1);
    lightSources.push({x: 400, y: 400, str: 300});
}

function draw() {
    background(255);

    ct = 0;
    fog.background(0); //set to black
    for (const light of lightSources) {
        //graded white circle at each light source
        for (let i = 0; i < light.str; i++) {
            fog.stroke(i);
            fog.circle(light.x, light.y, i);
            console.log(ct++);
        }
    }

    image(fog, 0, 0);
    console.log(frameRate());
}