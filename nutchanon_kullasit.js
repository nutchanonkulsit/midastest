const readline = require("readline");

class Data {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
  }

  pop() {
    return this.data.shift();
  }

  isEmpty() {
    return this.data.length === 0;
  }
}

function minEnergy(start, shops, stations, target) {
  const shopSet = new Set(shops);
  const stationSet = new Set(stations);
  const move = new Data();
  const initialVisitedShop = new Set();

  //Check if the start position have a shop
  if (shopSet.has(start)) {
    initialVisitedShop.add(start);
  }

  move.push({
    pos: start,
    energy: 0,
    visitedShops: initialVisitedShop,
  });

  while (!move.isEmpty()) {
    // Pop the first move from the queue
    const { pos, energy, visitedShops } = move.pop();

    // If we reach the target position with all shops visited, return the energy used
    if (pos === target && visitedShops.size === shopSet.size) {
      return energy;
    }

    //Move to the next positions
    for (const dir of [-1, 1]) {
      const nextPos = pos + dir;

      const newVisitedShops = new Set(visitedShops);
      //Check position is have a shop
      if (shopSet.has(nextPos)) newVisitedShops.add(nextPos);


      move.push({
        pos: nextPos,
        energy: energy + 1,
        visitedShops: newVisitedShops,
      });
    }

    if (stationSet.has(pos)) {
      for (const dest of stations) {
        if (dest === pos) continue;

        if (shopSet.has(dest)) {
          move.push({
            pos: dest,
            energy: energy,
            visitedShops: [...visitedShops, dest],
          });
        } else {
          move.push({
            pos: dest,
            energy: energy,
            visitedShops: [...visitedShops],
          });
        }
      }
    }
  }
  return 0;
}

// Read input from the console
const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    read.question(question, (answer) => resolve(answer));
  });
}

async function main() {
  const start = parseInt(await ask("Start: "));
  const shopsInput = await ask("Shop: ");
  const stationsInput = await ask("Station: ");
  const target = parseInt(await ask("Target: "));

  const shops = shopsInput.split(",").map(Number);
  const stations = stationsInput.split(",").map(Number);

  const result = minEnergy(start, shops, stations, target);
  console.log("Energy:", result);

  read.close();
}

main();
