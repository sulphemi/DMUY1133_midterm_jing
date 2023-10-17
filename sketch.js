let fog;
let lightSources = [];

function setup() {
    createCanvas(800, 800);
    fog = createImage(800, 800);
    fog.loadPixels();
    lightSources.push({x: 400, y: 400, str: 300});
}

function draw() {
    background(255);

    /*
    for (let i = 0; i < fog.width; i++) {
        for (let k = 0; k < fog.width; k++) {
            let lightLevel = 0;
            for (const light of lightSources) {
                lightLevel += light.str / dist(light.x, light.y, i, k);
            }
            if (lightLevel < 1) continue;
            if (lightLevel > 10) lightLevel = 10;
            let alpha = map(lightLevel, 0, 10, 255, 0); // 0..100 -> 255..0
            //fog.pixels[k*fog.width + i] = color(0, 0, 0, alpha);
            fog.set(i, k, [0, 0, 0, alpha]);
        }
    }
    */

    for (let i = 0; i < fog.width; i++) {
        for (let k = 0; k < fog.width; k++) {
            let lightLevel = 0;
            for (const light of lightSources) {
                lightLevel += light.str / dist(light.x, light.y, i, k);
            }
            if (lightLevel < 1) continue;
            if (lightLevel > 10) lightLevel = 10;
            let alpha = map(lightLevel, 0, 10, 255, 0); // 0..100 -> 255..0
            //fog.pixels[k*fog.width + i] = color(0, 0, 0, alpha);
            fog.set(i, k, [0, 0, 0, alpha]);
        }
    }

    fog.updatePixels();
    image(fog, 0, 0);
    console.log(frameRate());
}