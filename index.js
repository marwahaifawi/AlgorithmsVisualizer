canvasDisplay.width = 1000;
canvasDisplay.height = 500;
const margin = 30;
let array = [];
const cols = [];
const ctx = canvasDisplay.getContext("2d");

// Generate a random array of the specified length
function generateRandomArray(length) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 400) + 1);
  }
  return arr;
}

// Draw the current state of the array on the canvasDisplay
function drawArray(array, moves) {
  const availableWidth = canvasDisplay.width - margin;
  const barWidth = (availableWidth / array.length) * 0.8;
  ctx.clearRect(0, 0, canvasDisplay.width, canvasDisplay.height);
  for (let i = 0; i < array.length; i++) {
    const x =
      i * barWidth +
      margin +
      barWidth / 2 +
      (availableWidth - array.length * barWidth) / 2;
    const y = canvasDisplay.height - margin;
    const width = barWidth - 4;
    const height = array[i];
    cols[i] = new Column(x, y, width, height);
    const move = moves && moves.find((move) => move.indices.includes(i));
    if (move && move.type === "swap") {
      const color = move.indices.includes(i) ? "green" : "#acd6e6";
      cols[i].draw(ctx, color);
    } else if (move && move.type === "compare") {
      const color = move.indices.includes(i) ? "red" : "#acd6e6";
      cols[i].draw(ctx, color);
    } else cols[i].draw(ctx);
  }
}
array = generateRandomArray(parseInt(document.getElementById("length").value));
drawArray(array);

function bubbleSort(array) {
  const moves = [];
  for (let i = 0; i < array.length; i++) {
    let swapped = false;
    for (let j = 0; j < array.length - i - 1; j++) {
      moves.push({ indices: [j, j + 1], type: "compare" });
      if (array[j] > array[j + 1]) {
        // Swap elements
        swapped = true;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        moves.push({ indices: [j, j + 1], type: "swap" });
      }
      drawArray(array);
    }
    // If no moves were made, array is sorted
    if (!swapped) {
      break;
    }
  }
  return moves;
}

// Sort the array using selection sort and display the sorting process visually
async function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      moves.push({ indices: [j, minIndex], type: "compare" });
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      drawArray(array, [moves[moves.length - 1]]);
      await new Promise((r) => setTimeout(r, 400));
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      moves.push({ indices: [i, minIndex], type: "swap" });
      drawArray(array, [moves[moves.length - 1]]);
      await new Promise((r) => setTimeout(r, 400));
    }
    moves.push({ indices: [array.length - 1, minIndex], type: "done" });
    drawArray(array, [moves[moves.length - 1]]);
    await new Promise((r) => setTimeout(r, 400));
  }
  return moves;
}
function quickSort(array) {
  let moves = [];

  function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      moves.push({ indices: [j, high], type: "compare" });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        moves.push({ indices: [i, j], type: "swap" });
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    moves.push({ indices: [i + 1, high], type: "swap" });

    return i + 1;
  }

  function sort(array, low, high) {
    if (low < high) {
      let pivotIndex = partition(array, low, high);
      sort(array, low, pivotIndex - 1);
      sort(array, pivotIndex + 1, high);
    }
  }

  sort(array.slice(), 0, array.length - 1);

  return moves;
}
function animating(moves) {
  if (moves.length == 0) {
    drawArray(array);
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type === "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  drawArray(array, [move]);
  setTimeout(function () {
    animating(moves);
  }, 500);
}

// Bind the "randomize" button to generate a new random array
document.getElementById("randomize").addEventListener("click", () => {
  array = generateRandomArray(
    parseInt(document.getElementById("length").value)
  );
  drawArray(array);
});

// Bind the "solve" button to sort the current array using the selected algorithm
document.getElementById("solve").addEventListener("click", () => {
  const algorithm = document.getElementById("algorithm").value;
  switch (algorithm) {
    case "bubble":
      const copy1 = [...array];
      const move1 = bubbleSort(copy1);
      animating(move1);
      break;
    case "selection":
      const copy2 = [...array];
      const move2 = selectionSort(copy2);
      animating(move2);

      break;
    case "quickSort":
      const copy3 = [...array];
      const move3 = quickSort(copy3);
      animating(move3);

      break;
  }
});
