const colors = ["red", "blue", "green", "teal", "magenta", "purple", "orange", "pink", "black", "lime"];
const history = [];
let currentIndex = 0;
let highestIndexGenerated = 0;
let highCount = 0;
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
history.push({
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
});
function generateStocks() {
    let variance = 4.0;
    let colorCurrentValue = {
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
    if (iteration < 3) variance = 3.0;
    else if (iteration < 5) variance = 1.5;
    else if (iteration < 8) variance = 6.0;

    let scale = 300;
    if (iteration < 3) scale = 125;
    else if (iteration < 5) scale = 175;
    else if (iteration < 8) scale = 250;
    else if (iteration < 11) scale = 300;

    for (color of colors) {
        colorCurrentValue[color] = Math.round((boxMullerRandom(variance) * scale) / 10) * 10;
    }
    history.push({ ...colorCurrentValue });
    iteration++;
    history[iteration] = { ...colorCurrentValue };
    highestIndexGenerated = iteration;
    return colorCurrentValue;
}
function displayStocks(stockTicker = null) {
    // get the current stock values
    let colorCurrentValue = stockTicker || history[iteration];
    // get the last stock values
    let colorValueLast = history[iteration - 1] || {
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

    let text = "";
    for (color of colors) {
        let indicator = "stagnant";
        if (colorCurrentValue[color] >= colorValueLast[color] + 15) {
            indicator = "up";
            if (colorCurrentValue[color] >= colorValueLast[color] + 50) {
                indicator = "up_double";
            }
            if (colorCurrentValue[color] >= colorValueLast[color] + 100) {
                indicator = "up_triple";
            }
        } else if (colorCurrentValue[color] <= colorValueLast[color] - 15) {
            indicator = "down";
            if (colorCurrentValue[color] <= colorValueLast[color] - 50) {
                indicator = "down_double";
            }
            if (colorCurrentValue[color] <= colorValueLast[color] - 100) {
                indicator = "down_triple";
            }
        }
        if (iteration == 1 || currentIndex == 0) indicator = "stagnant";
        text += `<div class="stock ${color}"><div class="logo"><img class="indicator" src="images/${indicator}.png"/></div><div class="number"><span>$ ${
            colorCurrentValue[color]
        } M</span></div><div class="name">${color[0].toUpperCase() + color.slice(1)}</div></div>`;
    }
    document.querySelector("main").innerHTML = text;
    document.querySelector("#index").innerText = currentIndex;
}

let seed = Math.floor(Math.random() * 8999) + 1000;
console.log(seed);
document.querySelector("#seed").value = seed;
let rng = new Math.seedrandom(seed);

document.querySelector("#seed").addEventListener("input", (e) => {
    seed = parseInt(e.target.value);
    rng = new Math.seedrandom(seed);
});

document.querySelector("#next").addEventListener("click", () => {
    // generate only if we are at the end of the history
    if (currentIndex >= highestIndexGenerated) {
        console.log("Next, Generated new stocks");
        stockTicker = generateStocks();
    } else {
        stockTicker = history[currentIndex + 1] || null;
        console.log("Next, No new stocks generated. Using history.");
    }
    currentIndex = Math.min(highestIndexGenerated, currentIndex + 1);
    displayStocks(stockTicker);
});
document.querySelector("#prev").addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    displayStocks(history[currentIndex] || null);
    console.log("Prev");
});
