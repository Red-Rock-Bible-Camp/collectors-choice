const colors = ["red", "blue", "green", "teal", "magenta", "purple", "orange", "pink", "black", "lime"];
let iterations = 1;
let highCount = 0;
let colorCounts = {
    red: 0,
    blue: 0,
    green: 0,
    purple: 0,
    magenta: 0,
    teal: 0,
    orange: 0,
    pink: 0,
    black: 0,
    lime: 0,
};
let colorValueLast = {
    red: 0,
    blue: 0,
    green: 0,
    purple: 0,
    magenta: 0,
    teal: 0,
    orange: 0,
    pink: 0,
    black: 0,
    lime: 0,
};
function boxMullerRandom(variance = 1.0) {
    let u = 0,
        v = 0;
    while (u === 0) u = rng.quick();
    while (v === 0) v = rng.quick();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = (num * variance) / 10.0 + 0.575; // Translate to 0 -> 1
    if (num > 1 || num < 0) return boxMullerRandom(); // resample between 0 and 1
    return num;
}

iteration = 0;
function displayStocks() {
    let variance = 4.0;
    if (iteration < 3) variance = 3.0;
    else if (iteration < 5) variance = 1.5;
    else if (iteration < 8) variance = 6.0;

    let scale = 300;
    if (iteration < 3) scale = 125;
    else if (iteration < 5) scale = 175;
    else if (iteration < 8) scale = 250;
    else if (iteration < 11) scale = 300;

    let text = "";
    for (color of colors) {
        // Generate a normally distributed random number between 0 and 1, scale it to 0-300, and round to nearest 5
        colorValue = Math.round((boxMullerRandom(variance) * scale) / 10) * 10;
        let indicator = "stagnant";
        if (colorValue >= colorValueLast[color] + 15) {
            indicator = "up";
            if (colorValue >= colorValueLast[color] + 50) {
                indicator = "up_double";
            }
            if (colorValue >= colorValueLast[color] + 100) {
                indicator = "up_triple";
            }
        } else if (colorValue <= colorValueLast[color] - 15) {
            indicator = "down";
            if (colorValue <= colorValueLast[color] - 50) {
                indicator = "down_double";
            }
            if (colorValue <= colorValueLast[color] - 100) {
                indicator = "down_triple";
            }
        }
        if (iteration == 0) indicator = "stagnant";
        colorValueLast[color] = colorValue;
        if (colorValue >= 200) {
            highCount++;
            colorCounts[color]++;
        }
        text += `<div class="stock${
            colorValue >= 200 ? " high" : ""
        } ${color}"><div class="logo"><img class="indicator" src="images/${indicator}.png"/></div><div class="number"><span>$ ${colorValue} M</span></div><div class="name">${
            color[0].toUpperCase() + color.slice(1)
        }</div></div>`;
    }
    document.querySelector("main").innerHTML = text;
    iteration++;
    document.querySelector("#index").innerText = iteration;
}

let seed = Math.floor(Math.random() * 8999) + 1000;
console.log(seed);
document.querySelector("#seed").value = seed;
let rng = new Math.seedrandom(seed);

document.querySelector("#seed").addEventListener("input", (e) => {
    seed = parseInt(e.target.value);
    rng = new Math.seedrandom(seed);
});

document.querySelector("button").addEventListener("click", () => {
    displayStocks();
    console.log("Next");
});
